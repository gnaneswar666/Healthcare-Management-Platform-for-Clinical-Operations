package com.infosys.SIMULATION_SERVICE.util;


import java.util.Random;

import org.springframework.stereotype.Component;

@Component
public class RandomValueGenerator {

    private final Random random = new Random();

    public int randomInt(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }

    public double randomDouble(double min, double max) {
        return min + (max - min) * random.nextDouble();
    }

    public boolean randomBoolean() {
        return random.nextBoolean();
    }
}
