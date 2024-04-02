```mermaid
sequenceDiagram
    activate Admin
    actor Admin
    Admin ->> Login: click on Login button
    activate Login
    Login ->> Validate: validate email and password
    deactivate Login
    activate Validate
    Validate ->> Database: Check database
    deactivate Validate
    activate Database
    alt email and password match
    Database -->> Admin: Display admin management
    else email and password is not match
    Database -->> Admin: Notify login error
    end
    deactivate Database
    deactivate Admin
    