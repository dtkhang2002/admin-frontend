```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> SearchFile: Click on search file button
    activate SearchFile
    SearchFile ->> Validate: Validate information input
    deactivate SearchFile
    activate Validate
    alt information input is null
    Validate -->> Admin: Display list file management screen
    else information input is not null
    Validate ->> Database: Check database
    deactivate Validate
    activate Database
    alt not found data depend on information input
    Database -->> Admin: Display list null
    else found data depend on information input
    Database -->> Admin: Display list file result
    deactivate Database
    end
    end
    
    deactivate Admin