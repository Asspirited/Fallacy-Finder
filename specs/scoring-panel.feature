Feature: Scoring panel — NAVARRO assessment
  The internal panel produces a ScoreCard from the transcript and baseline.
  Users never see the panel directly — only the ScoreCard output.

  Background:
    Given a BaselineProfile has been established

  Scenario: Panel returns a ScoreCard from any transcript
    When the panel assesses a transcript
    Then a ScoreCard is returned
    And the ScoreCard has a summary
    And the ScoreCard has a debrief note

  Scenario: Panel flags discomfort when service history topics appear
    When the panel assesses a transcript containing questions about brakes or MOT
    Then the ScoreCard comfortMap includes a discomfort signal on service history

  Scenario: Panel returns no discomfort flags for neutral topics
    When the panel assesses a transcript containing only neutral questions
    Then the ScoreCard comfortMap is empty
