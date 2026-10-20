package com.spring;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// No implementation needed: Spring Data generates it at startup.
// You get save(), findById(), findAll(), delete() for free.
public interface GameRepo extends JpaRepository<Game, Long> {

    // Spring builds the SQL from the method name: ORDER BY created_at DESC
    List<Game> findAllByOrderByCreatedAtDesc();
}