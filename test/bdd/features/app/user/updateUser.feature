@app @user @updateUser
Feature: Get user by email

    Returns an error if user is not found

    Scenario: Updating a user when system is empty
        Given the system does not contain any users
        When I update user with:
            | lastname | firstname | email                    |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com |
        Then the operation is failing
        And I get a "User with email gilles.cruchon@gmail.com not found" error

    Scenario: Updating an existing user
        Given the system contains these users:
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 14    |
        When I update user with:
            | lastname        | firstname        | email                    |
            | UPDATEDLASTNAME | UpdatedFirstName | gilles.cruchon@gmail.com |
        Then the operation is successful
        And I get the user
            | lastname        | firstname        | email                    | score |
            | UPDATEDLASTNAME | UpdatedFirstName | gilles.cruchon@gmail.com | 14    |