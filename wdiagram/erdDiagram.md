```mermaid
erDiagram
    LangchainPgCollection ||--|{ LangchainPgEmbedding: contains

    Role ||--|{ User: contains
    User ||--|{ Trainfile: has
    User {
        integer id PK
        varchar(255) email UK
        varchar(255) full_name
        varchar(255) password
        timestamp created_at
        timestamp updated_at
        integer role_id FK
    }

    Role {
        integer id PK
        varchar(255) name
        timestamp created_at
        timestamp updated_at
    }

    Trainfile {
        integer id PK
        varchar(255) file_name
        varchar(255) file_path
        integer status
        timestamp created_at
        timestamp updated_at
        integer user_id FK
    }

    Settings {
        integer id PK
        double threshold_score
        integer number_references
        double temperature
        integer maximum_number_questions
        text prompt_question
        text prompt_answer
        timestamp created_at
        timestamp updated_at
    }

    History {
        integer id PK
        varchar(255) question 
        varchar(255) answer
        varchar(255) user_id
        timestamp created_at
        timestamp updated_at
    }

    LangchainPgCollection {
        uuid uuid PK
        varchar(255) name
        json cmetadata
    }

    LangchainPgEmbedding {
        uuid uuid PK
        cmetadata json
        vector embedding
        varchar(255) custom_id
        varchar(255) document
        uuid collection_uuid FK
    }

    Token {
        int id PK
        text access_token UK
        text refresh_token UK
        timestamp created_at
        timestamp updated_at
    }