# Connection Frontend-Backend - Services et Hooks

Ce document explique comment le frontend se connecte au backend via les services et hooks créés pour chaque endpoint.

## Structure des Services

### Services API

Les services sont organisés par domaine fonctionnel :

- **authService.js** - Gestion de l'authentification (login, logout, register)
- **utilisateurService.js** - Gestion des utilisateurs (stats, admins, médecins par service)
- **patientService.js** - Gestion des patients (CRUD, patients récents médecin)
- **medecinService.js** - Gestion des médecins (CRUD, inscription)
- **servicesService.js** - Gestion des services médicaux (CRUD, stats)
- **crenauxService.js** - Gestion des créneaux (récupération, génération, changement statut)
- **planningConfigService.js** - Configuration des plannings médecin
- **rendezVousService.js** - Gestion des rendez-vous (prise RDV, stats, planning, historique)

### Hooks par Endpoint

Chaque endpoint possède son hook React correspondant, organisé par module :

#### Authentification (`/services/hooks/auth/`)

- `useLogin.js` - Hook pour la connexion utilisateur
- `useLogout.js` - Hook pour la déconnexion
- `useRegister.js` - Hook pour l'inscription

#### Patients (`/services/hooks/patients/`)

- `useGetAllPatients.js` - Récupérer tous les patients
- `useAddPatient.js` - Ajouter un patient
- `useUpdatePatient.js` - Modifier un patient
- `useDeletePatient.js` - Supprimer un patient
- `usePatientsRecentsMedecin.js` - Patients récents d'un médecin

#### Médecins (`/services/hooks/medecins/`)

- `useGetAllMedecins.js` - Récupérer tous les médecins
- `useRegisterMedecin.js` - Inscrire un médecin
- `useUpdateMedecin.js` - Modifier un médecin
- `useDeleteMedecin.js` - Supprimer un médecin

#### Créneaux (`/services/hooks/creneaux/`)

- `useCrenauxMedecin.js` - Créneaux d'un médecin
- `useGenererCreneaux.js` - Générer des créneaux
- `useChangerStatutCreneau.js` - Changer statut créneau

#### Planning (`/services/hooks/planning/`)

- `useAddPlanningConfig.js` - Ajouter config planning
- `usePlanningsByDateRange.js` - Planning sur plage de dates
- `useAddPlanningConfigMulti.js` - Config planning multiple

#### Rendez-vous (`/services/hooks/rendezVous/`)

- `usePrendreRendezVous.js` - Prendre un rendez-vous
- `useRendezVousStats.js` - Statistiques RDV globales
- `useStatsJourMedecin.js` - Stats du jour pour médecin
- `useChangerStatutRDV.js` - Changer statut RDV
- `usePlanningSemaneMedecin.js` - Planning semaine médecin
- `useHistoriqueMedecin.js` - Historique consultations médecin

#### Utilisateurs (`/services/hooks/utilisateurs/`)

- `useUserStats.js` - Statistiques utilisateurs
- `useMedecinsParService.js` - Médecins par service
- `useGetAdmins.js` - Récupérer admins
- `useRegisterAdmin.js` - Inscrire admin
- `useDeleteAdmin.js` - Supprimer admin
- `useUpdateAdmin.js` - Modifier admin

## Utilisation

### Import des Services

```javascript
import {
  authService,
  patientService,
  medecinService,
  // ... autres services
} from "../services";
```

### Import des Hooks

```javascript
import {
  useLogin,
  useGetAllPatients,
  useCrenauxMedecin,
  usePrendreRendezVous,
} from "../services";
```

### Exemple d'utilisation dans un composant

```javascript
import { useLogin, useGetAllPatients } from "../services";

const MonComposant = () => {
  const { login, loading: loginLoading } = useLogin();
  const { patients, fetchPatients, loading } = useGetAllPatients();

  // Utilisation...
};
```

## Configuration API

Le client API (`client.js`) gère automatiquement :

- L'ajout des headers d'authentification
- La gestion des erreurs HTTP
- Le parsing JSON des réponses
- La redirection en cas de token expiré

## Points de Connexion Backend

Tous les endpoints du backend Java sont connectés :

### Auth Resource (`/api/auth`)

- POST `/login` - Connexion
- POST `/logout` - Déconnexion
- POST `/register` - Inscription

### Utilisateurs Resource (`/api/utilisateurs`)

- GET `/stats` - Statistiques utilisateurs
- GET `/admins` - Liste des admins
- GET `/medecin-par-service` - Médecins par service
- GET `/{id}` - Utilisateur par ID
- POST `/` - Créer utilisateur
- PUT `/{id}` - Modifier utilisateur
- PUT `/me` - Modifier utilisateur courant
- DELETE `/{id}` - Supprimer utilisateur

### Patients Resource (`/api/patients`)

- GET `/` - Tous les patients
- POST `/` - Ajouter patient
- PUT `/{id}` - Modifier patient
- DELETE `/{id}` - Supprimer patient
- GET `/medecin/{medecinId}/recent` - Patients récents médecin

### Médecins Resource (`/api/medecins`)

- GET `/` - Tous les médecins
- POST `/register` - Inscrire médecin
- PUT `/{id}` - Modifier médecin
- DELETE `/{id}` - Supprimer médecin

### Services Resource (`/api/services`)

- GET `/` - Tous les services
- GET `/{id}` - Service par ID
- POST `/` - Créer service
- PUT `/{id}` - Modifier service
- DELETE `/{id}` - Supprimer service
- GET `/stats` - Statistiques services

### Créneaux Resource (`/api/creneaux`)

- GET `/medecin/{medecinId}` - Créneaux médecin
- POST `/medecin/{medecinId}/generate` - Générer créneaux
- PUT `/{id}/statut` - Changer statut créneau

### Planning Config Resource (`/api/planning-config`)

- POST `/{medecinId}` - Ajouter config planning
- POST `/{medecinId}/plage` - Planning par plage dates
- POST `/multi/{medecinId}` - Config planning multiple

### Rendez-vous Resource (`/api/rendezvous`)

- POST `/` - Prendre rendez-vous
- GET `/stats` - Statistiques RDV
- GET `/medecin/{medecinId}/stats-du-jour` - Stats jour médecin
- PUT `/{id}/statut` - Changer statut RDV
- GET `/medecin/{medecinId}/planning-semaine` - Planning semaine
- GET `/medecin/{medecinId}/historique` - Historique médecin
