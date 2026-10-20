package com.spring;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
@Getter
@Setter
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL AUTO_INCREMENT
    private Long id;

    private String player1;
    private String player2;

    // "P1", "P2", "TIE", or null while the game is running
    private String winner;

	// "IN_PROGRESS" or "FINISHED"
    private String status = "IN_PROGRESS";

    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPlayer1() {
		return player1;
	}

	public void setPlayer1(String player1) {
		this.player1 = player1;
	}

	public String getPlayer2() {
		return player2;
	}

	public void setPlayer2(String player2) {
		this.player2 = player2;
	}

	public String getWinner() {
		return winner;
	}

	public void setWinner(String winner) {
		this.winner = winner;
	}

	public List<Round> getRounds() {
		return rounds;
	}

	public void setRounds(List<Round> rounds) {
		this.rounds = rounds;
	}


	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}



    // One game has many rounds. "mappedBy" = the Round.game field owns the foreign key.
    // cascade ALL = saving a game also saves its rounds.
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @OrderBy("roundNo ASC")
    private List<Round> rounds = new ArrayList<>();
}
