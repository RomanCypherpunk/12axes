package com.twelveaxes.service;

import com.twelveaxes.model.*;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CandidateMatcherService {
    private final QuizDataService data; private final ProfileMatchScorer scorer;
    public CandidateMatcherService(QuizDataService data, ProfileMatchScorer scorer) { this.data = data; this.scorer = scorer; }
    public List<CandidateMatch> findMatches(List<AxisResult> axes) {
        Map<String, Double> user = scorer.userVectorFor(axes);
        return data.getCandidates().stream().filter(Candidate::active)
                .map(c -> new Ranked(c, scorer.compatibility(user, data.getCandidateProfiles().get(c.id()).vector())))
                .sorted(Comparator.comparingDouble(Ranked::score).reversed().thenComparing(r -> r.candidate().name()))
                .map(r -> { Candidate c=r.candidate(); return new CandidateMatch(c.id(),c.name(),c.shortName(),c.role(),c.description(),c.party(),c.partyName(),c.ballotNumber(),c.runningMate(),c.imagePath(),c.imageSourceName(),c.imageSourceUrl(),c.imageNote(),r.score()); }).toList();
    }
    private record Ranked(Candidate candidate, double score) {}
}
