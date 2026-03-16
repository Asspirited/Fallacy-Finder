Feature: Calibration phase
  As a user beginning a session
  I want to complete a short baseline establishment
  So that the system has a reference point for my truthful responses

  Background:
    Given the user has begun a session
    And the calibration phase is active

  Scenario: Calibration explains its purpose before the user begins
    Then the user sees an explanation of what calibration is for
    And the user sees an explanation of why a deliberate lie is one of the steps

  Scenario Outline: User progresses through each calibration step
    Given the user is on step <step> of the calibration
    And the prompt displayed is "<prompt>"
    When the user submits a text response
    Then the progress indicator shows step <step> of 3 complete
    And the system records the response against step <step> of the BaselineProfile

    Examples:
      | step | prompt                                                               |
      | 1    | Tell us your name and something that happened to you last week       |
      | 2    | Describe a room in your home                                         |
      | 3    | Tell us one deliberate lie about something that happened this morning |

  Scenario: Calibration completes after all three steps
    Given the user has submitted responses to all three calibration steps
    Then the user sees a completion message
    And the system holds a BaselineProfile for the current session
    And the user can proceed to their scenario
