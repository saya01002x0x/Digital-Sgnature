package sis.hust.edu.vn.digital_signature.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bucket;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@Getter
public class RateLimitConfig {

    @Value("${rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    @Value("${rate-limit.requests-per-hour:1000}")
    private int requestsPerHour;

    @Value("${rate-limit.enabled:true}")
    private boolean enabled;

    private Cache<String, Bucket> bucketCache;

    @PostConstruct
    public void init() {
        bucketCache = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofHours(1))
                .maximumSize(10_000)
                .build();
    }

    @Bean
    public Cache<String, Bucket> bucketCacheBean() {
        if (bucketCache == null) {
            init();
        }
        return bucketCache;
    }

    public Bucket resolveBucket(String key) {
        if (bucketCache == null) {
            init();
        }
        return bucketCache.get(key, k -> Bucket.builder()
                .addLimit(limit -> limit
                        .capacity(requestsPerMinute)
                        .refillIntervally(requestsPerMinute, Duration.ofMinutes(1))
                )
                .addLimit(limit -> limit
                        .capacity(requestsPerHour)
                        .refillIntervally(requestsPerHour, Duration.ofHours(1))
                )
                .build());
    }
}


