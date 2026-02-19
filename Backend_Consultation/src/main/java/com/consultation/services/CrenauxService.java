package com.consultation.services;

import com.consultation.models.Crenaux;
import com.consultation.models.StatutCrenau;
import com.consultation.models.Medecin;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class CrenauxService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Retourne les créneaux d'un médecin avec filtres optionnels
     */
    public List<Crenaux> getCrenauxMedecin(Long medecinId, String date, String statut) {
        StringBuilder jpql = new StringBuilder("SELECT c FROM Crenaux c WHERE c.medecin.id = :medecinId");
        
        if (date != null && !date.isEmpty()) {
            jpql.append(" AND c.dateDay = :date");
        }
        
        if (statut != null && !statut.isEmpty()) {
            jpql.append(" AND c.statut = :statut");
        }
        
        jpql.append(" ORDER BY c.dateDay, c.heureDebut");
        
        var query = em.createQuery(jpql.toString(), Crenaux.class)
                .setParameter("medecinId", medecinId);
        
        if (date != null && !date.isEmpty()) {
            query.setParameter("date", LocalDate.parse(date));
        }
        
        if (statut != null && !statut.isEmpty()) {
            query.setParameter("statut", StatutCrenau.valueOf(statut.toUpperCase()));
        }
        
        return query.getResultList();
    }

    /**
     * Génère des créneaux pour un médecin selon la configuration fournie
     */
    @Transactional
    public List<Crenaux> genererCreneaux(Long medecinId, Map<String, Object> config) {
        Medecin medecin = em.find(Medecin.class, medecinId);
        if (medecin == null) {
            throw new IllegalArgumentException("Médecin introuvable");
        }

        LocalDate dateDebut = LocalDate.parse((String) config.get("dateDebut"));
        LocalDate dateFin = LocalDate.parse((String) config.get("dateFin"));
        LocalTime heureDebut = LocalTime.parse((String) config.get("heureDebut"));
        LocalTime heureFin = LocalTime.parse((String) config.get("heureFin"));
        int dureeSeance = Integer.parseInt(config.get("dureeSeance").toString());
        
        // Pause optionnelle (format "12:00-13:00")
        LocalTime pauseDebut = null;
        LocalTime pauseFin = null;
        if (config.get("pauseHeure") != null) {
            String pause = (String) config.get("pauseHeure");
            if (pause.contains("-")) {
                String[] pauseParts = pause.split("-");
                pauseDebut = LocalTime.parse(pauseParts[0]);
                pauseFin = LocalTime.parse(pauseParts[1]);
            }
        }

        List<Crenaux> crenauxGeneres = new ArrayList<>();
        
        // Générer pour chaque jour
        LocalDate currentDate = dateDebut;
        while (!currentDate.isAfter(dateFin)) {
            // Ignorer les dimanches (optionnel)
            if (currentDate.getDayOfWeek() != java.time.DayOfWeek.SUNDAY) {
                
                LocalTime currentHeure = heureDebut;
                while (currentHeure.isBefore(heureFin)) {
                    LocalTime finCreneau = currentHeure.plusMinutes(dureeSeance);
                    
                    // Vérifier si le créneau ne chevauche pas avec la pause
                    boolean chercheauPause = false;
                    if (pauseDebut != null && pauseFin != null) {
                        chercheauPause = !(finCreneau.isBefore(pauseDebut) || currentHeure.isAfter(pauseFin));
                    }
                    
                    if (!chercheauPause && !finCreneau.isAfter(heureFin)) {
                        // Vérifier que le créneau n'existe pas déjà
                        long existant = em.createQuery(
                            "SELECT COUNT(c) FROM Crenaux c WHERE c.medecin.id = :medecinId " +
                            "AND c.dateDay = :date AND c.heureDebut = :heure", Long.class)
                            .setParameter("medecinId", medecinId)
                            .setParameter("date", currentDate)
                            .setParameter("heure", currentHeure)
                            .getSingleResult();
                        
                        if (existant == 0) {
                            Crenaux creneau = new Crenaux();
                            creneau.setMedecin(medecin);
                            creneau.setDateDay(currentDate);
                            creneau.setHeureDebut(currentHeure);
                            creneau.setHeureFin(finCreneau);
                            creneau.setStatut(StatutCrenau.LIBRE);
                            
                            em.persist(creneau);
                            crenauxGeneres.add(creneau);
                        }
                    }
                    
                    // Passer à l'heure suivante, en sautant la pause si nécessaire
                    currentHeure = currentHeure.plusMinutes(dureeSeance);
                    if (pauseDebut != null && currentHeure.equals(pauseDebut)) {
                        currentHeure = pauseFin;
                    }
                }
            }
            currentDate = currentDate.plusDays(1);
        }
        
        return crenauxGeneres;
    }

    /**
     * Change le statut d'un créneau
     */
    @Transactional
    public Crenaux changerStatut(Long creneauId, String nouveauStatut) {
        Crenaux creneau = em.find(Crenaux.class, creneauId);
        if (creneau == null) {
            throw new IllegalArgumentException("Créneau introuvable");
        }
        
        StatutCrenau statut = StatutCrenau.valueOf(nouveauStatut.toUpperCase());
        creneau.setStatut(statut);
        
        em.merge(creneau);
        return creneau;
    }
}