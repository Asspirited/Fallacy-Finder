Feature: Landing screen
  As a user arriving at Fallacy Finder
  I want to understand immediately what this product is
  So that I can decide to engage

  Background:
    Given the user has opened the application

  Scenario: App identity is displayed on load
    Then the user sees the heading "Fallacy Finder"
    And the user sees a description of the product below the slogan

  Scenario: Slogans cycle automatically through all four
    Then the slogan area eventually displays each of the following:
      | We know when you're lying.              |
      | You can't control what you reveal.      |
      | Truth is a baseline. Deviation is data. |
      | The test is unreliable. So are you.     |
    And each slogan transitions to the next automatically

  Scenario: User can begin a session from the landing screen
    When the user activates the begin control
    Then the calibration phase begins
