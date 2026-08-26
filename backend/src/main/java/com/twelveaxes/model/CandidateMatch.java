package com.twelveaxes.model;

public record CandidateMatch(String candidateId, String name, String role, String description, String party, String partyName,
                             String ballotNumber, String runningMate, String imagePath, String imageSourceName,
                             String imageSourceUrl, String imageNote, double compatibility) {}
