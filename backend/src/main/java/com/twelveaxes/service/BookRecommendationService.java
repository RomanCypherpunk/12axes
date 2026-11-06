package com.twelveaxes.service;

import com.twelveaxes.model.Book;
import com.twelveaxes.model.BookRecommendation;
import com.twelveaxes.model.PersonalityMatch;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class BookRecommendationService {
    static final int MAX_BOOKS = 3;
    // Uma conta de Associados por loja: a tag do Brasil nao rende nada na amazon.com.
    static final String AMAZON_BR_HOST = "www.amazon.com.br";
    static final String AMAZON_BR_TAG = "12axes-20";
    static final String AMAZON_US_HOST = "www.amazon.com";
    static final String AMAZON_US_TAG = "12axes0d-20";

    private final QuizDataService dataService;

    public BookRecommendationService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Livros das personalidades mais compativeis (geral + melhor de cada area de
     * atuacao) que tem livro cadastrado, da maior para a menor compatibilidade.
     */
    public List<BookRecommendation> recommend(
            List<PersonalityMatch> generalMatches,
            List<PersonalityMatch> areaMatches,
            String lang
    ) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        Map<String, Book> books = dataService.getBooks();
        Map<String, PersonalityMatch> candidates = new LinkedHashMap<>();
        Stream.concat(generalMatches.stream(), areaMatches.stream())
                .filter(match -> books.containsKey(match.personalityId()))
                .forEach(match -> candidates.putIfAbsent(match.personalityId(), match));

        return candidates.values().stream()
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility).reversed())
                .limit(MAX_BOOKS)
                .map(match -> toRecommendation(match, books.get(match.personalityId()), normalizedLang))
                .toList();
    }

    private BookRecommendation toRecommendation(PersonalityMatch match, Book book, String lang) {
        String title = localized(book.title(), lang);
        // Fora do português a busca é na Amazon americana, com o autor em inglês.
        String storeAuthor = match.name();
        if (!QuizDataService.LANG_PT.equals(lang)) {
            var english = dataService.getPersonalityById(match.personalityId(), QuizDataService.LANG_EN);
            storeAuthor = english == null ? match.name() : english.name();
        }
        return new BookRecommendation(
                match.personalityId(),
                match.name(),
                match.imagePath(),
                title,
                book.year(),
                affiliateUrl(localized(book.url(), lang), searchTitle(book, lang, title), storeAuthor, lang),
                match.compatibility()
        );
    }

    static String affiliateUrl(String directUrl, String title, String author, String lang) {
        if (directUrl != null && !directUrl.isBlank()) {
            return directUrl;
        }
        // Só o português compra na Amazon do Brasil.
        boolean english = !QuizDataService.LANG_PT.equals(lang);
        String query = URLEncoder.encode(title + " " + author, StandardCharsets.UTF_8);
        return "https://" + (english ? AMAZON_US_HOST : AMAZON_BR_HOST)
                + "/s?k=" + query + "&i=stripbooks&tag=" + (english ? AMAZON_US_TAG : AMAZON_BR_TAG);
    }

    /** Na Amazon americana a busca usa o título em inglês: edições em espanhol raramente estão lá. */
    private static String searchTitle(Book book, String lang, String shownTitle) {
        if (QuizDataService.LANG_PT.equals(lang)) {
            return shownTitle;
        }
        String english = book.title() == null ? null : book.title().get(QuizDataService.LANG_EN);
        return english == null || english.isBlank() ? shownTitle : english;
    }

    private static String localized(Map<String, String> values, String lang) {
        if (values == null) {
            return null;
        }
        String value = values.get(lang);
        if (value != null && !value.isBlank()) {
            return value;
        }
        String english = values.get(QuizDataService.LANG_EN);
        return QuizDataService.LANG_PT.equals(lang) || english == null || english.isBlank()
                ? values.get(QuizDataService.LANG_PT)
                : english;
    }
}
