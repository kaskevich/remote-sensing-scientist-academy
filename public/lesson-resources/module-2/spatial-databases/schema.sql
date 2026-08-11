-- Synthetic teaching schema for Module 2 Chapter 7.
-- Review before running and use only in a disposable training database.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA IF NOT EXISTS academy;

CREATE TABLE academy.meadow_sites (
  site_id text PRIMARY KEY,
  site_name text NOT NULL,
  region_code text NOT NULL UNIQUE,
  management_status text NOT NULL,
  source_status text NOT NULL CHECK (source_status = 'synthetic')
);

CREATE TABLE academy.management_zones (
  zone_id text PRIMARY KEY,
  zone_name text NOT NULL,
  management_type text NOT NULL,
  geom geometry(Polygon, 3301) NOT NULL
);

CREATE TABLE academy.field_plots (
  plot_id text PRIMARY KEY,
  site_id text NOT NULL REFERENCES academy.meadow_sites(site_id),
  plot_label text NOT NULL UNIQUE,
  geom geometry(Point, 3301) NOT NULL,
  qa_status text NOT NULL CHECK (qa_status IN ('accept', 'review_boundary'))
);

CREATE TABLE academy.plot_observations (
  observation_id text PRIMARY KEY,
  plot_id text NOT NULL REFERENCES academy.field_plots(plot_id),
  survey_date date NOT NULL,
  ndvi_mean double precision CHECK (ndvi_mean BETWEEN -1 AND 1),
  biomass_g_m2 double precision CHECK (biomass_g_m2 IS NULL OR biomass_g_m2 >= 0),
  qa_status text NOT NULL,
  source_status text NOT NULL CHECK (source_status = 'synthetic'),
  UNIQUE (plot_id, survey_date)
);

CREATE INDEX field_plots_geom_gix
  ON academy.field_plots USING gist (geom);
CREATE INDEX management_zones_geom_gix
  ON academy.management_zones USING gist (geom);
CREATE INDEX observations_plot_date_idx
  ON academy.plot_observations (plot_id, survey_date);

CREATE VIEW academy.accepted_observations AS
SELECT observation_id, plot_id, survey_date, ndvi_mean, biomass_g_m2
FROM academy.plot_observations
WHERE qa_status = 'accept';
