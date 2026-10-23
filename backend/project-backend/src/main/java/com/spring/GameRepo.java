package com.spring;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepo extends JpaRepository<Game, Long> {

    List<Game> findAllByOrderByCreatedAtDesc();
}