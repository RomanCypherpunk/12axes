package com.twelveaxes.service;

import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import org.springframework.stereotype.Service;

/**
 * Resolve o país que representa a ideologia escolhida.
 *
 * <p>O país não é mais pontuado de forma independente contra o usuário: ele é o exemplo
 * (atual ou histórico) atrelado à ideologia de maior compatibilidade. A compatibilidade
 * exibida espelha a da ideologia, já que o país a representa.
 */
@Service
public class CountryResolverService {
    private final QuizDataService dataService;

    public CountryResolverService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public CountryMatch resolveFor(IdeologyMatch topMatch) {
        Ideology ideology = dataService.getIdeologyById(topMatch.ideologyId());
        if (ideology == null) {
            throw new IllegalStateException("Ideologia não encontrada: " + topMatch.ideologyId());
        }
        Country country = dataService.getCountryById(ideology.countryId());
        if (country == null) {
            throw new IllegalStateException(
                    "País não encontrado para a ideologia " + ideology.id() + ": " + ideology.countryId()
            );
        }
        return new CountryMatch(
                country.id(),
                country.name(),
                country.category(),
                country.description(),
                country.flagPath(),
                country.flagKind(),
                country.flagSourceName(),
                country.flagSourceUrl(),
                country.flagNote(),
                country.historical(),
                country.period(),
                topMatch.compatibility()
        );
    }
}
