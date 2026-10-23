package com.spring;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "rounds",
       uniqueConstraints = @UniqueConstraint(columnNames = {"game_id", "roundNo"}))
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    @JsonIgnore
    private Game game;

    private int roundNo;     
    private String p1Choice; 
    private String p2Choice;
    private String result;   
    
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
