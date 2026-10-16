package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.EraResolver;
import org.junit.jupiter.api.Test;

class EraResolverTest {
    @Test
    void deathYearOfCommonLifespanFormats() {
        assertThat(EraResolver.yearOfDeath("1906–1982")).isEqualTo(1982);
        assertThat(EraResolver.yearOfDeath("1873-1960")).isEqualTo(1960);
        assertThat(EraResolver.yearOfDeath("c. 5–c. 67")).isEqualTo(67);
        assertThat(EraResolver.yearOfDeath("428/427–348/347 a.C.")).isEqualTo(-348);
        assertThat(EraResolver.yearOfDeath("63 a.C.–14 d.C.")).isEqualTo(14);
        assertThat(EraResolver.yearOfDeath("100 a.C.–44 a.C.")).isEqualTo(-44);
    }

    @Test
    void livingOrUndatedProfilesFallInTheLastEra() {
        for (String lifespan : new String[] {"1964–", "1948–presente", "s.d.–", "", null}) {
            assertThat(EraResolver.eraOfYear(EraResolver.yearOfDeath(lifespan)).key())
                    .as("lifespan %s", lifespan).isEqualTo("xxi");
        }
    }

    @Test
    void startYearOfPeriods() {
        assertThat(EraResolver.startYear("1933–1945")).contains(1933);
        assertThat(EraResolver.startYear("509–27 a.C.")).contains(-509);
        assertThat(EraResolver.startYear("27 a.C.–476 d.C.")).contains(-27);
        assertThat(EraResolver.startYear("c. 900–192 a.C.")).contains(-900);
        assertThat(EraResolver.startYear("2024–")).contains(2024);
        assertThat(EraResolver.startYear("")).isEmpty();
    }

    @Test
    void erasCoverTheWholeTimelineWithoutGaps() {
        assertThat(EraResolver.eraOfYear(-3000).key()).isEqualTo("antiguidade");
        assertThat(EraResolver.eraOfYear(475).key()).isEqualTo("antiguidade");
        assertThat(EraResolver.eraOfYear(476).key()).isEqualTo("medieval");
        assertThat(EraResolver.eraOfYear(1499).key()).isEqualTo("medieval");
        assertThat(EraResolver.eraOfYear(1500).key()).isEqualTo("moderna");
        assertThat(EraResolver.eraOfYear(1800).key()).isEqualTo("xix");
        assertThat(EraResolver.eraOfYear(1900).key()).isEqualTo("xx");
        assertThat(EraResolver.eraOfYear(2000).key()).isEqualTo("xxi");
        assertThat(EraResolver.eraOfYear(2100).key()).isEqualTo("xxi");
    }
}
