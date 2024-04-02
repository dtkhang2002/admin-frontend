```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> UpdateUser: Click on add user button
    activate UpdateUser
    UpdateUser ->> Validate: Validate user information input
    deactivate UpdateUser
    activate Validate
    alt invalid user information input
    Validate -->> Admin: Notify invalid user information input
    else valid user information input
    Validate ->> Database: Save to database
    deactivate Validate
    activate Database
    Database -->> Admin: Notify update user successfully
    deactivate Database
    end
    
    deactivate Admin