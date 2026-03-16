Feature: Ray Worker — Cloudflare Worker ACL for SellerAgent
  The client POSTs conversation history to the Worker and renders Ray's reply.
  Replaces the stub getRayResponse. User experience is identical.

  Background:
    Given calibration is complete
    And Mode C is active

  Scenario: Client sends conversation history and renders reply
    Given the user has typed a message
    When the user sends the message
    Then the client POSTs to the Worker with the full conversation history
    And the reply is rendered in the chat log as a seller entry

  Scenario: Send button is disabled while awaiting Worker response
    Given the user has typed a message
    When the user sends the message
    Then the send button is disabled until the reply arrives
    And the send button is re-enabled when the reply is rendered

  Scenario: Client shows error entry if Worker call fails
    Given the Worker endpoint is unavailable
    When the user sends a message
    Then an error entry appears in the chat log
    And the send button is re-enabled

Feature: Ray Worker — request builder (pure logic, pipeline testable)
  The buildRayRequest function produces a valid Worker payload.

  Scenario: buildRayRequest returns correct shape from transcript
    Given a transcript with two entries
    When buildRayRequest is called with the transcript
    Then the result has a messages array
    And each entry has a role and content field
    And user transcript entries map to role "user"
    And seller transcript entries map to role "assistant"
