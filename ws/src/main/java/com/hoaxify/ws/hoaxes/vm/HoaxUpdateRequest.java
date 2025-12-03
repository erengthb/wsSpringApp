package com.hoaxify.ws.hoaxes.vm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HoaxUpdateRequest {

    @NotBlank
    @Size(min = 1, max = 1000)
    private String content;
}
