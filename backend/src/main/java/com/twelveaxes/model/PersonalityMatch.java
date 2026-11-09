package com.twelveaxes.model;

import java.util.Map;

public record PersonalityMatch(
        String personalityId,
        String name,
        String role,
        String category,
        String lifespan,
        String description,
        String imagePath,
        String imageSourceName,
        String imageSourceUrl,
        String imageNote,
        double compatibility,
        double compatibilityPercentile,
        // Vetor de 12 eixos (leftPercent) da personalidade, usado pelo front para
        // mostrar os eixos que aproximam o usuario dela.
        Map<String, Double> vector,
        // Espectro (categoria da ideologia mais proxima do vetor dele): define a cor dele na tela. So o governo ideal
        // preenche; nas demais listas fica nulo.
        String spectrum
) {

    public PersonalityMatch withSpectrum(String value) {
        return new PersonalityMatch(personalityId, name, role, category, lifespan, description, imagePath,
                imageSourceName, imageSourceUrl, imageNote, compatibility, compatibilityPercentile, vector, value);
    }
}
