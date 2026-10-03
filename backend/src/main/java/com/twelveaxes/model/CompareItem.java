package com.twelveaxes.model;

/**
 * Entrada leve do catalogo de comparacao (busca da tela de resultados).
 *
 * @param type "personality", "country" ou "ideology"
 * @param id identificador do perfil no catalogo do tipo
 * @param name nome exibido
 * @param caption linha de apoio: cargo (personalidade), periodo ou categoria (pais), categoria (ideologia)
 * @param imagePath retrato ou bandeira; null para ideologias, que nao tem imagem
 * @param category categoria do perfil, usada para a cor do espectro nas ideologias
 * @param historical true para paises historicos
 */
public record CompareItem(
        String type,
        String id,
        String name,
        String caption,
        String imagePath,
        String category,
        boolean historical
) {
}
