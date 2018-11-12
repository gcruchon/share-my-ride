@app @user @delete
Feature: Delete a user

    User can be either an existing driver or an existing passenger

    Scenario: Delete an existing user
        Given the affected user is:
        | lastname  | firstname  | email                     |
        | CRUCHON   | Gilles     | gilles.cruchon@gmail.com  |
        And user "gilles.cruchon@gmail.com" already exists in the system
        When I delete user "gilles.cruchon@gmail.com"
        Then the operation is successful
        And I get the user
        | lastname  | firstname  | email                     | score |
        | CRUCHON   | Gilles     | gilles.cruchon@gmail.com  | 0     |

    Scenario: Delete a non-existing user
        Given the affected user is:
        | lastname  | firstname  | email                     |
        | CRUCHON   | Gilles     | gilles.cruchon@gmail.com  |
        And user "gilles.cruchon@gmail.com" does not exist in the system
        When I delete user "gilles.cruchon@gmail.com"
        Then the operation is failing
        And I get a "User not exist" error
