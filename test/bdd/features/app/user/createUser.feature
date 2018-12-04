@app @user @create
Feature: Create a user

    User can be either a driver or a passenger.
    After creating a user, you should receive the created user's info.
    Should you fail to input a required field, the output should give your the list of missing required fields.

    Scenario: Create a user providing all required fields
        Given the affected user is:
            | lastname | firstname | email                    |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com |
        And user "gilles.cruchon@gmail.com" does not exist in the system
        When I create this user
        Then the operation is successful
        And I get the user
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |

    Scenario: Create user duplicated user
        Given the affected user is:
            | lastname | firstname | email                    |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com |
        And user "gilles.cruchon@gmail.com" already exists in the system
        When I create this user
        Then the operation is failing
        And I get a "User already exists" error

    Scenario: Create a user without email
        Given the affected user is:
            | lastname | firstname |
            | CRUCHON  | Gilles    |
        When I create this user
        Then the operation is failing
        And I get the missing fields:
            | email |

    Scenario: Create a user without lastname
        Given the affected user is:
            | firstname | email                    |
            | Gilles    | gilles.cruchon@gmail.com |
        When I create this user
        Then the operation is failing
        And I get the missing fields:
            | lastname |

    Scenario: Create a user without firstname
        Given the affected user is:
            | lastname | email                    |
            | CRUCHON  | gilles.cruchon@gmail.com |
        When I create this user
        Then the operation is failing
        And I get the missing fields:
            | firstname |

    Scenario: Create a user without lastname & firstname
        Given the affected user is:
            | email                    |
            | gilles.cruchon@gmail.com |
        When I create this user
        Then the operation is failing
        And I get the missing fields:
            | lastname  |
            | firstname |

