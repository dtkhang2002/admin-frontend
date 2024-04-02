```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> SearchHistory: Click on search file button
    activate SearchHistory
    SearchHistory ->> Validate: Validate information input
    deactivate SearchHistory
    activate Validate
    alt information input is null
    Validate -->> Admin: Display list chat history management screen
    else information input is not null
    Validate ->> Database: Check database
    deactivate Validate
    activate Database
    alt not found data depend on information input
    Database -->> Admin: Display list null
    else found data depend on information input
    Database -->> Admin: Display list chat history result
    deactivate Database
    end
    end
    
    deactivate Admin