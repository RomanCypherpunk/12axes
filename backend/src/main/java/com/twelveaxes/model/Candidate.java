package com.twelveaxes.model;

public record Candidate(String id, String name, String role, String description, String party, String partyName,
                        String ballotNumber, String runningMate, boolean active, String imagePath,
                        String imageSourceName, String imageSourceUrl, String imageNote) {}
