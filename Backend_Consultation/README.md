# Démarrage rapide (Payara Micro 7)

Pour lancer l'application avec la configuration JDBC MySQL :

```
java -jar payara-micro-7.2026.1.jar \
	--deploy target/Projet_Gestion_Consultation-1.0-SNAPSHOT.war \
	--postbootcommandfile postboot.txt \
	--addlibs mysql-connector-j-9.5.0/mysql-connector-j-9.5.0.jar
```

- Assurez-vous que le fichier `postboot.txt` contient la création du pool JDBC.
- Le driver MySQL doit être accessible dans le dossier indiqué.
- MySQL doit être démarré et accessible sur `localhost:3306`.

## Pour toute erreur de connexion

- Vérifiez la configuration du pool JDBC dans `postboot.txt`
- Vérifiez les droits et le mot de passe MySQL
- Ajoutez `?useSSL=false` à l'URL JDBC si besoin

---

src/main/java/com/consultation/
│
├── config/
│ ├── ApplicationConfig.java <-- Active JAX-RS (@ApplicationPath)
│ ├── SecurityFilter.java <-- Filtre JWT (ContainerRequestFilter)
│ └── Provisier.java <-- Injection de dépendances (CDI)
│
├── resources/ <-- Les Contrôleurs
│ ├── AuthResource.java <-- Login et génération de Token
│ ├── MedecinResource.java <-- @RolesAllowed("Medecin")
│ └── PatientResource.java <-- @RolesAllowed("Patient")
│
├── services/ <-- La couche métier (Transactional)
│ ├── ConsultationService.java <-- Logique @Transactional
│ └── AuthService.java <-- Vérification des mots de passe
│
├── repositories/ <-- Couche d'accès (DAO)
│ ├── GenericRepository.java <-- Méthodes CRUD communes
│ └── CrenauRepository.java <-- Requêtes JPQL spécifiques
│
├── models/ <-- Les Entités JPA (@Entity)
│ ├── Utilisateur.java <-- Table mère
│ ├── Medecin.java <-- Extension
│ └── Crenau.java
│
├── dto/ <-- Data Transfer Objects
│ ├── LoginRequest.java
│ └── CrenauDTO.java <-- Données formatées pour le JSON
│
└── mappers/ <-- Conversion
└── CrenauMapper.java <-- Transforme Entity en DTO
