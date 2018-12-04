@app @user @getAll
Feature: Get all users

    The list is sorted in reverse order of the creation date (i.e. user created recently will appear first).
    The list is limited to the last 50 users created.

    Scenario: Getting all users when none are created
        Given the system does not contain any users
        When I get all users
        Then the operation is successful
        And I get an empty list of users

    Scenario: Getting all users when less then 50 are created
        Given the system contains these users:
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |
            | CRUCHON  | Fabien    | fgoguillon@gmail.com     | 0     |
        When I get all users
        Then the operation is successful
        And I get these users:
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |
            | CRUCHON  | Fabien    | fgoguillon@gmail.com     | 0     |
