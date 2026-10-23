package com.spring;


import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:5173/") // for local 
public class GameController {

    private static final int TOTAL_ROUNDS = 6;
    private static final Set<String> CHOICES = Set.of("STONE", "PAPER", "SCISSORS");

    private final GameRepo games;

    public GameController(GameRepo games) {
        this.games = games;
    }

    record NewGame(String player1, String player2) {}
    record NewRound(int roundNo, String p1Choice, String p2Choice) {}

    @PostMapping
    public Game create(@RequestBody NewGame req) {
        if (blank(req.player1()) || blank(req.player2())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Both names are required");
        }
        Game g = new Game();
        g.setPlayer1(req.player1().trim());
        g.setPlayer2(req.player2().trim());
        return games.save(g);
    }

    @GetMapping
    public List<Game> all() {
        return games.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public Game one(@PathVariable Long id) {
        return find(id);
    }

    @PostMapping("/{id}/rounds")
    @Transactional
    public Game addRound(@PathVariable Long id, @RequestBody NewRound req) {
        Game g = find(id);

        if (g.getStatus().equals("FINISHED")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Game already finished");
        }
        if (req.roundNo() != g.getRounds().size() + 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Wrong round number");
        }
        if (!CHOICES.contains(req.p1Choice()) || !CHOICES.contains(req.p2Choice())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid choice");
        }

        Round r = new Round();
        r.setGame(g);
        r.setRoundNo(req.roundNo());
        r.setP1Choice(req.p1Choice());
        r.setP2Choice(req.p2Choice());
        r.setResult(decide(req.p1Choice(), req.p2Choice()));
        g.getRounds().add(r);

        if (g.getRounds().size() == TOTAL_ROUNDS) {
            g.setWinner(overallWinner(g));
            g.setStatus("FINISHED");
        }
        return games.save(g);
    }


    private Game find(Long id) {
        return games.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));
    }

    private boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private String decide(String a, String b) {
        if (a.equals(b)) return "TIE";
        boolean p1Wins = (a.equals("STONE") && b.equals("SCISSORS"))
                      || (a.equals("SCISSORS") && b.equals("PAPER"))
                      || (a.equals("PAPER") && b.equals("STONE"));
        return p1Wins ? "P1" : "P2";
    }

    private String overallWinner(Game g) {
        long p1 = g.getRounds().stream().filter(r -> r.getResult().equals("P1")).count();
        long p2 = g.getRounds().stream().filter(r -> r.getResult().equals("P2")).count();
        if (p1 == p2) return "TIE";
        return p1 > p2 ? "P1" : "P2";
    }
}
