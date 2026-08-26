package com.twelveaxes.model;

import java.util.List;
public record ElectionResult(List<AxisResult> axes, List<CandidateMatch> matches) {}
