package com.hoaxify.ws.hoaxes;

/**
 * Centralized Hoax status values to avoid magic numbers in code and queries.
 */
public final class HoaxStatus {

    private HoaxStatus() {
    }

    public static final int DELETED = 0;
    public static final int ACTIVE = 1;
}
