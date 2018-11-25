@app @ride @create
Feature: Create a ride

    A ride must have a Driver.
    A ride must have at least on Passenger.
    A ride cannot have more than 4 Passenger.
    A ride must have a date.
    A user cannot participate to more than 2 rides per day.

    Scenario: Create a ride providing all required fields
        Given this driver exists:
            | lastname | firstname | email                    | score |
            | CRUCHON  | Gilles    | gilles.cruchon@gmail.com | 0     |
        And theses passengers exist:
            | lastname  | firstname | email                | score |
            | GOGUILLON | Fabien    | fgoguillon@gmail.com | 0     |
        And the affected ride is:
            | driver                   | passenger1           | passenger2 | passenger3 | passenger4 | date                 |
            | gilles.cruchon@gmail.com | fgoguillon@gmail.com |            |            |            | 2018-11-24T10:33:23Z |
        When I create this ride
        Then the operation is successful
        And I get the ride
            | driver                   | passenger1           | passenger2 | passenger3 | passenger4 | date                 |
            | gilles.cruchon@gmail.com | fgoguillon@gmail.com |            |            |            | 2018-11-24T10:33:23Z |
