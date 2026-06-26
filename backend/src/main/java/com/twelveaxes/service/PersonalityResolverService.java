package com.twelveaxes.service;

import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import org.springframework.stereotype.Service;

/**
 * Resolve a personalidade (político ou teórico) que melhor representa a ideologia escolhida.
 *
 * <p>Espelha {@link CountryResolverService}: a figura é atrelada à ideologia de maior
 * compatibilidade e a compatibilidade exibida espelha a da ideologia.
 */
@Service
public class PersonalityResolverService {
    private final QuizDataService dataService;

    public PersonalityResolverService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public PersonalityMatch resolveFor(IdeologyMatch topMatch) {
        Ideology ideology = dataService.getIdeologyById(topMatch.ideologyId());
        if (ideology == null) {
            throw new IllegalStateException("Ideologia não encontrada: " + topMatch.ideologyId());
        }
        Personality personality = dataService.getPersonalityById(ideology.personalityId());
        if (personality == null) {
            throw new IllegalStateException(
                    "Personalidade não encontrada para a ideologia " + ideology.id() + ": " + ideology.personalityId()
            );
        }
        return new PersonalityMatch(
                personality.id(),
                personality.name(),
                personality.role(),
                personality.lifespan(),
                personality.description(),
                personality.imagePath(),
                personality.imageSourceName(),
                personality.imageSourceUrl(),
                personality.imageNote(),
                topMatch.compatibility()
        );
    }
}
