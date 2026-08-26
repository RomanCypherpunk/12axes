package com.twelveaxes.model;

import java.util.Map;
public record CandidateProfile(String candidateId, Map<String, Double> vector) {}
