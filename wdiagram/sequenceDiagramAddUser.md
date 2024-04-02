```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> AddUser: Click on add user button
    activate AddUser
    AddUser ->> Validate: Validate user information input
    deactivate AddUser
    activate Validate
    alt invalid user information input
    Validate -->> Admin: Notify invalid user information input
    else valid user information input
    Validate ->> Database: Save to database
    deactivate Validate
    activate Database
    Database -->> Admin: Notify add user successfully
    deactivate Database
    end
    
    deactivate Admin