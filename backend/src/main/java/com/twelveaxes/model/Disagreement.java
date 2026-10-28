package com.twelveaxes.model;

import java.util.List;

/**
 * Onde o usuario mais discorda do perfil mais compativel de um tipo.
 *
 * @param kind "ideology", "personality" ou "country"
 * @param profileId id do perfil comparado
 * @param profileName nome do perfil no idioma pedido
 * @param ideologyCategory categoria (espectro politico) da ideologia mais proxima DESTE perfil: define a cor dele na tela
 * @param axes os 12 eixos, do que mais destoa do perfil para o que menos destoa
 */
public record Disagreement(String kind, String profileId, String profileName, String ideologyCategory, List<AxisDivergence> axes) {
}
