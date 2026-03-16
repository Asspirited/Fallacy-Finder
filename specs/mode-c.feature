Feature: Mode C — Car Purchase scenario
  As a user who has completed calibration
  I want to interrogate a car seller
  So that I can practise detecting a legalistic deception pattern

  Background:
    Given the user has completed calibration
    And Mode C is active

  Scenario: User sees the scenario introduction
    Then the user sees the seller's name
    And the user sees a brief scenario description

  Scenario: User sends a message and receives a response
    When the user sends a message to the seller
    Then the user sees a response from the seller

  Scenario: User can request an assessment
    Given the user has sent at least one message
    When the user activates the assessment control
    Then the user sees a ScoreCard

  Scenario: ScoreCard contains the required elements
    Given the user has asked about service history
    When the user requests an assessment
    Then the ScoreCard shows a comfort reading for at least one topic
    And the ScoreCard shows a summary line
    And the ScoreCard shows a debrief note
