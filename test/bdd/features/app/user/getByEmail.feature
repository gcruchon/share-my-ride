@app @user @getByEmail
Feature: Get user by email

    Returns an error if user is not found

    Scenario: Getting an user by email when system is empty
        Given the system does not contain any users
        When I get user "gilles.cruchon@gmail.com"
        Then the operation is failing
        And I get a "User not found" error

    Scenario: Getting an existing user by email
        Given the system contains these users:
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |
        When I get user "gilles.cruchon@gmail.com"
        Then the operation is successful
        And I get the user
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |