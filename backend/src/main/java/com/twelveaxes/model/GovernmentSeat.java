package com.twelveaxes.model;

/**
 * Um cargo do governo ideal do usuario.
 *
 * @param seatKey cargo: lider, vice, economia, educacao, estrategia, filosofia, social, industria ou cultura
 * @param category categoria de personalidade que ocupa o cargo (politico, economista, intelectual...)
 * @param holder personalidade mais compativel daquela categoria
 * @param candidates as mais compativeis da categoria (a titular inclusive), da mais para a menos compativel: de onde o
 *     usuario escolhe outra para o cargo; vazia na previa gratuita
 */
public record GovernmentSeat(String seatKey, String category, PersonalityMatch holder, java.util.List<PersonalityMatch> candidates) {
}
