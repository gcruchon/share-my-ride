@user
Feature: Create a user

    User can be either a driver or a passenger

    Scenario: Create a user providing all required fields
        Given I want to create this user:
        | lastname  | firstname  | email                     |
        | CRUCHON   | Gilles     | gilles.cruchon@gmail.com  |
        When I create this user
        Then the creation is successful
        And I get the user
        | lastname  | firstname  | email                     | score |
        | CRUCHON   | Gilles     | gilles.cruchon@gmail.com  | 0     |

    Scenario: Create a user without email
        Given I want to create this user:
        | lastname  | firstname  |
        | CRUCHON   | Gilles     |
        When I create this user
        Then the creation is failing
        And I get the missing fields:
        | email |

    Scenario: Create a user without lastname
        Given I want to create this user:
        | firstname  | email                     |
        | Gilles     | gilles.cruchon@gmail.com  |
        When I create this user
        Then the creation is failing
        And I get the missing fields:
        | lastname |

    Scenario: Create a user without firstname
        Given I want to create this user:
        | lastname  | email                     |
        | CRUCHON   | gilles.cruchon@gmail.com  |
        When I create this user
        When I create this user
        Then the creation is failing
        And I get the missing fields:
        | firstname |

    Scenario: Create a user without lastname & firstname
        Given I want to create this user:
        | email                     |
        | gilles.cruchon@gmail.com  |
        When I create this user
        When I create this user
        Then the creation is failing
        And I get the missing fields:
        | lastname |
        | firstname |

