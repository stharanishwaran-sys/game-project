package com.spring;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "rounds",
       // A game can't have two round #3s (protects against double submits)
       uniqueConstraints = @UniqueConstraint(columnNames = {"game_id", "roundNo"}))
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many rounds belong to one game; creates the game_id foreign key column.
    // @JsonIgnore stops an infinite loop (game -> rounds -> game -> ...) in JSON.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    @JsonIgnore
    private Game game;

    private int roundNo;       // 1..6
    private String p1Choice;   // STONE / PAPER / SCISSORS
    private String p2Choice;
    private String result;   
    // "P1", "P2" or "TIE"
    
    @Autowired
	public void setGame(Game game) {
		this.game = game;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getRoundNo() {
		return roundNo;
	}
	public void setRoundNo(int roundNo) {
		this.roundNo = roundNo;
	}
	public String getP1Choice() {
		return p1Choice;
	}
	public void setP1Choice(String p1Choice) {
		this.p1Choice = p1Choice;
	}
	public String getP2Choice() {
		return p2Choice;
	}
	public void setP2Choice(String p2Choice) {
		this.p2Choice = p2Choice;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
    
    
}
