package com.twelveaxes.model;

/**
 * Personalidade mais compativel com o usuario em UMA dimensao do perfil
 * (politica, social ou economica), e nao nos 12 eixos somados.
 *
 * Serve para responder "com quem eu combino politicamente?", que e uma pergunta
 * diferente de "com quem eu combino no geral": alguem pode compartilhar sua
 * visao economica e discordar de tudo o mais.
 *
 * @param dimension identificador da dimensao (political, social, economic)
 * @param match personalidade mais compativel considerando so os eixos da dimensao
 */
public record DimensionMatch(
        String dimension,
        PersonalityMatch match
) {
}
