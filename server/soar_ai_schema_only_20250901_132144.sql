--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (84ade85)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer_target_companies DROP CONSTRAINT IF EXISTS api_traveloffer_targ_traveloffer_id_f5ff6ed7_fk_api_trave;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer_target_companies DROP CONSTRAINT IF EXISTS api_traveloffer_targ_company_id_b7ac8b17_fk_api_compa;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer DROP CONSTRAINT IF EXISTS api_traveloffer_created_by_id_8302f089_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_supportticket DROP CONSTRAINT IF EXISTS api_supportticket_contact_id_f88e966f_fk_api_contact_id;
ALTER TABLE IF EXISTS ONLY public.api_supportticket DROP CONSTRAINT IF EXISTS api_supportticket_company_id_37091f98_fk_api_company_id;
ALTER TABLE IF EXISTS ONLY public.api_supportticket DROP CONSTRAINT IF EXISTS api_supportticket_assigned_to_id_58ef3c94_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_proposaldraft DROP CONSTRAINT IF EXISTS api_proposaldraft_opportunity_id_fd7fb498_fk_api_opportunity_id;
ALTER TABLE IF EXISTS ONLY public.api_opportunityactivity DROP CONSTRAINT IF EXISTS api_opportunityactivity_created_by_id_145d5cd4_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_opportunityactivity DROP CONSTRAINT IF EXISTS api_opportunityactiv_opportunity_id_4ca456a3_fk_api_oppor;
ALTER TABLE IF EXISTS ONLY public.api_opportunity DROP CONSTRAINT IF EXISTS api_opportunity_lead_id_18545556_fk_api_lead_id;
ALTER TABLE IF EXISTS ONLY public.api_leadnote DROP CONSTRAINT IF EXISTS api_leadnote_lead_id_b0673144_fk_api_lead_id;
ALTER TABLE IF EXISTS ONLY public.api_leadnote DROP CONSTRAINT IF EXISTS api_leadnote_created_by_id_1d483ee9_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_leadhistory DROP CONSTRAINT IF EXISTS api_leadhistory_user_id_ecc34f8a_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_leadhistory DROP CONSTRAINT IF EXISTS api_leadhistory_lead_id_7e0a62f4_fk_api_lead_id;
ALTER TABLE IF EXISTS ONLY public.api_lead DROP CONSTRAINT IF EXISTS api_lead_contact_id_dc816d20_fk_api_contact_id;
ALTER TABLE IF EXISTS ONLY public.api_lead DROP CONSTRAINT IF EXISTS api_lead_company_id_be70c00a_fk_api_company_id;
ALTER TABLE IF EXISTS ONLY public.api_lead DROP CONSTRAINT IF EXISTS api_lead_assigned_to_id_f0f68950_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign DROP CONSTRAINT IF EXISTS api_emailcampaign_template_id_3c213a84_fk_api_campa;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign_target_leads DROP CONSTRAINT IF EXISTS api_emailcampaign_target_leads_lead_id_5af85417_fk_api_lead_id;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign_target_leads DROP CONSTRAINT IF EXISTS api_emailcampaign_ta_emailcampaign_id_214b3ace_fk_api_email;
ALTER TABLE IF EXISTS ONLY public.api_contractbreach DROP CONSTRAINT IF EXISTS api_contractbreach_contract_id_27a736ec_fk_api_contract_id;
ALTER TABLE IF EXISTS ONLY public.api_contract DROP CONSTRAINT IF EXISTS api_contract_opportunity_id_da447352_fk_api_opportunity_id;
ALTER TABLE IF EXISTS ONLY public.api_contract DROP CONSTRAINT IF EXISTS api_contract_company_id_e37b23ce_fk_api_company_id;
ALTER TABLE IF EXISTS ONLY public.api_contact DROP CONSTRAINT IF EXISTS api_contact_company_id_f4d09d00_fk_api_company_id;
ALTER TABLE IF EXISTS ONLY public.api_aiconversation DROP CONSTRAINT IF EXISTS api_aiconversation_user_id_1a71143d_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.api_activitylog DROP CONSTRAINT IF EXISTS api_activitylog_user_id_460724d0_fk_auth_user_id;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
DROP INDEX IF EXISTS public.api_traveloffer_target_companies_traveloffer_id_f5ff6ed7;
DROP INDEX IF EXISTS public.api_traveloffer_target_companies_company_id_b7ac8b17;
DROP INDEX IF EXISTS public.api_traveloffer_created_by_id_8302f089;
DROP INDEX IF EXISTS public.api_supportticket_ticket_number_e2907423_like;
DROP INDEX IF EXISTS public.api_supportticket_contact_id_f88e966f;
DROP INDEX IF EXISTS public.api_supportticket_company_id_37091f98;
DROP INDEX IF EXISTS public.api_supportticket_assigned_to_id_58ef3c94;
DROP INDEX IF EXISTS public.api_opportunityactivity_opportunity_id_4ca456a3;
DROP INDEX IF EXISTS public.api_opportunityactivity_created_by_id_145d5cd4;
DROP INDEX IF EXISTS public.api_leadnote_lead_id_b0673144;
DROP INDEX IF EXISTS public.api_leadnote_created_by_id_1d483ee9;
DROP INDEX IF EXISTS public.api_leadhistory_user_id_ecc34f8a;
DROP INDEX IF EXISTS public.api_leadhistory_lead_id_7e0a62f4;
DROP INDEX IF EXISTS public.api_lead_contact_id_dc816d20;
DROP INDEX IF EXISTS public.api_lead_company_id_be70c00a;
DROP INDEX IF EXISTS public.api_lead_assigned_to_id_f0f68950;
DROP INDEX IF EXISTS public.api_emailcampaign_template_id_3c213a84;
DROP INDEX IF EXISTS public.api_emailcampaign_target_leads_lead_id_5af85417;
DROP INDEX IF EXISTS public.api_emailcampaign_target_leads_emailcampaign_id_214b3ace;
DROP INDEX IF EXISTS public.api_contractbreach_contract_id_27a736ec;
DROP INDEX IF EXISTS public.api_contract_contract_number_f1accfc0_like;
DROP INDEX IF EXISTS public.api_contract_company_id_e37b23ce;
DROP INDEX IF EXISTS public.api_contact_company_id_f4d09d00;
DROP INDEX IF EXISTS public.api_aiconversation_user_id_1a71143d;
DROP INDEX IF EXISTS public.api_activitylog_user_id_460724d0;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer_target_companies DROP CONSTRAINT IF EXISTS api_traveloffer_target_companies_pkey;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer_target_companies DROP CONSTRAINT IF EXISTS api_traveloffer_target_c_traveloffer_id_company_i_79bd13d8_uniq;
ALTER TABLE IF EXISTS ONLY public.api_traveloffer DROP CONSTRAINT IF EXISTS api_traveloffer_pkey;
ALTER TABLE IF EXISTS ONLY public.api_supportticket DROP CONSTRAINT IF EXISTS api_supportticket_ticket_number_key;
ALTER TABLE IF EXISTS ONLY public.api_supportticket DROP CONSTRAINT IF EXISTS api_supportticket_pkey;
ALTER TABLE IF EXISTS ONLY public.api_revenueforecast DROP CONSTRAINT IF EXISTS api_revenueforecast_pkey;
ALTER TABLE IF EXISTS ONLY public.api_proposaldraft DROP CONSTRAINT IF EXISTS api_proposaldraft_pkey;
ALTER TABLE IF EXISTS ONLY public.api_proposaldraft DROP CONSTRAINT IF EXISTS api_proposaldraft_opportunity_id_key;
ALTER TABLE IF EXISTS ONLY public.api_opportunityactivity DROP CONSTRAINT IF EXISTS api_opportunityactivity_pkey;
ALTER TABLE IF EXISTS ONLY public.api_opportunity DROP CONSTRAINT IF EXISTS api_opportunity_pkey;
ALTER TABLE IF EXISTS ONLY public.api_opportunity DROP CONSTRAINT IF EXISTS api_opportunity_lead_id_key;
ALTER TABLE IF EXISTS ONLY public.api_leadnote DROP CONSTRAINT IF EXISTS api_leadnote_pkey;
ALTER TABLE IF EXISTS ONLY public.api_leadhistory DROP CONSTRAINT IF EXISTS api_leadhistory_pkey;
ALTER TABLE IF EXISTS ONLY public.api_lead DROP CONSTRAINT IF EXISTS api_lead_pkey;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign_target_leads DROP CONSTRAINT IF EXISTS api_emailcampaign_target_leads_pkey;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign_target_leads DROP CONSTRAINT IF EXISTS api_emailcampaign_target_emailcampaign_id_lead_id_be87f6f2_uniq;
ALTER TABLE IF EXISTS ONLY public.api_emailcampaign DROP CONSTRAINT IF EXISTS api_emailcampaign_pkey;
ALTER TABLE IF EXISTS ONLY public.api_contractbreach DROP CONSTRAINT IF EXISTS api_contractbreach_pkey;
ALTER TABLE IF EXISTS ONLY public.api_contract DROP CONSTRAINT IF EXISTS api_contract_pkey;
ALTER TABLE IF EXISTS ONLY public.api_contract DROP CONSTRAINT IF EXISTS api_contract_opportunity_id_key;
ALTER TABLE IF EXISTS ONLY public.api_contract DROP CONSTRAINT IF EXISTS api_contract_contract_number_key;
ALTER TABLE IF EXISTS ONLY public.api_contact DROP CONSTRAINT IF EXISTS api_contact_pkey;
ALTER TABLE IF EXISTS ONLY public.api_company DROP CONSTRAINT IF EXISTS api_company_pkey;
ALTER TABLE IF EXISTS ONLY public.api_campaigntemplate DROP CONSTRAINT IF EXISTS api_campaigntemplate_pkey;
ALTER TABLE IF EXISTS ONLY public.api_aiconversation DROP CONSTRAINT IF EXISTS api_aiconversation_session_id_key;
ALTER TABLE IF EXISTS ONLY public.api_aiconversation DROP CONSTRAINT IF EXISTS api_aiconversation_pkey;
ALTER TABLE IF EXISTS ONLY public.api_activitylog DROP CONSTRAINT IF EXISTS api_activitylog_pkey;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.api_traveloffer_target_companies;
DROP TABLE IF EXISTS public.api_traveloffer;
DROP TABLE IF EXISTS public.api_supportticket;
DROP TABLE IF EXISTS public.api_revenueforecast;
DROP TABLE IF EXISTS public.api_proposaldraft;
DROP TABLE IF EXISTS public.api_opportunityactivity;
DROP TABLE IF EXISTS public.api_opportunity;
DROP TABLE IF EXISTS public.api_leadnote;
DROP TABLE IF EXISTS public.api_leadhistory;
DROP TABLE IF EXISTS public.api_lead;
DROP TABLE IF EXISTS public.api_emailcampaign_target_leads;
DROP TABLE IF EXISTS public.api_emailcampaign;
DROP TABLE IF EXISTS public.api_contractbreach;
DROP TABLE IF EXISTS public.api_contract;
DROP TABLE IF EXISTS public.api_contact;
DROP TABLE IF EXISTS public.api_company;
DROP TABLE IF EXISTS public.api_campaigntemplate;
DROP TABLE IF EXISTS public.api_aiconversation;
DROP TABLE IF EXISTS public.api_activitylog;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: api_activitylog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_activitylog (
    id bigint NOT NULL,
    action_type character varying(20) NOT NULL,
    action character varying(255) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id integer NOT NULL,
    details jsonb NOT NULL,
    ip_address inet,
    "timestamp" timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: api_activitylog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_activitylog ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_activitylog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_aiconversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_aiconversation (
    id bigint NOT NULL,
    session_id uuid NOT NULL,
    query text NOT NULL,
    response text NOT NULL,
    context jsonb NOT NULL,
    entities_mentioned jsonb NOT NULL,
    actions_suggested jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: api_aiconversation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_aiconversation ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_aiconversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_campaigntemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_campaigntemplate (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    channel_type character varying(20) NOT NULL,
    target_industry character varying(100) NOT NULL,
    subject_line character varying(255),
    content text NOT NULL,
    cta character varying(255) NOT NULL,
    linkedin_type character varying(20),
    estimated_open_rate double precision NOT NULL,
    estimated_click_rate double precision NOT NULL,
    is_custom boolean NOT NULL,
    created_by character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: api_campaigntemplate_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_campaigntemplate ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_campaigntemplate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_company; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_company (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    industry character varying(50) NOT NULL,
    size character varying(20) NOT NULL,
    location character varying(255) NOT NULL,
    website character varying(200),
    annual_revenue numeric(15,2),
    employee_count integer,
    travel_budget numeric(12,2),
    description text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    annual_travel_volume character varying(100) NOT NULL,
    company_type character varying(50) NOT NULL,
    credit_rating character varying(10) NOT NULL,
    current_airlines text NOT NULL,
    email character varying(254) NOT NULL,
    expansion_plans character varying(20) NOT NULL,
    payment_terms character varying(20) NOT NULL,
    phone character varying(20) NOT NULL,
    preferred_class character varying(20) NOT NULL,
    risk_level character varying(20) NOT NULL,
    specialties text NOT NULL,
    sustainability_focus character varying(20) NOT NULL,
    technology_integration text NOT NULL,
    travel_frequency character varying(20) NOT NULL,
    year_established integer,
    move_as_lead boolean NOT NULL
);


--
-- Name: api_company_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_company ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_contact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_contact (
    id bigint NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(254) NOT NULL,
    phone character varying(20) NOT NULL,
    "position" character varying(100) NOT NULL,
    department character varying(20) NOT NULL,
    is_decision_maker boolean NOT NULL,
    linkedin_profile character varying(200) NOT NULL,
    notes text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    company_id bigint NOT NULL
);


--
-- Name: api_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_contact ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_contract; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_contract (
    id bigint NOT NULL,
    contract_number character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    contract_type character varying(30) NOT NULL,
    status character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    value numeric(12,2) NOT NULL,
    terms text NOT NULL,
    renewal_terms text NOT NULL,
    auto_renewal boolean NOT NULL,
    notice_period_days integer NOT NULL,
    risk_score integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    company_id bigint NOT NULL,
    opportunity_id bigint
);


--
-- Name: api_contract_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_contract ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_contract_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_contractbreach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_contractbreach (
    id bigint NOT NULL,
    breach_type character varying(20) NOT NULL,
    severity character varying(10) NOT NULL,
    description text NOT NULL,
    detected_date timestamp with time zone NOT NULL,
    resolved_date timestamp with time zone,
    is_resolved boolean NOT NULL,
    financial_impact numeric(10,2),
    resolution_notes text NOT NULL,
    contract_id bigint NOT NULL
);


--
-- Name: api_contractbreach_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_contractbreach ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_contractbreach_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_emailcampaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_emailcampaign (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    campaign_type character varying(20) NOT NULL,
    status character varying(20) NOT NULL,
    subject_line character varying(255) NOT NULL,
    email_content text NOT NULL,
    scheduled_date timestamp with time zone,
    sent_date timestamp with time zone,
    emails_sent integer NOT NULL,
    emails_opened integer NOT NULL,
    emails_clicked integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    template_id bigint
);


--
-- Name: api_emailcampaign_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_emailcampaign ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_emailcampaign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_emailcampaign_target_leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_emailcampaign_target_leads (
    id bigint NOT NULL,
    emailcampaign_id bigint NOT NULL,
    lead_id bigint NOT NULL
);


--
-- Name: api_emailcampaign_target_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_emailcampaign_target_leads ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_emailcampaign_target_leads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_lead; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_lead (
    id bigint NOT NULL,
    status character varying(20) NOT NULL,
    source character varying(20) NOT NULL,
    priority character varying(10) NOT NULL,
    score integer NOT NULL,
    estimated_value numeric(12,2),
    notes text NOT NULL,
    next_action character varying(255) NOT NULL,
    next_action_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    assigned_to_id integer,
    company_id bigint NOT NULL,
    contact_id bigint NOT NULL,
    assigned_agent character varying(255)
);


--
-- Name: api_lead_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_lead ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_lead_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_leadhistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_leadhistory (
    id bigint NOT NULL,
    history_type character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    details text NOT NULL,
    icon character varying(20) NOT NULL,
    metadata jsonb NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    lead_id bigint NOT NULL,
    user_id integer
);


--
-- Name: api_leadhistory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_leadhistory ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_leadhistory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_leadnote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_leadnote (
    id bigint NOT NULL,
    note text NOT NULL,
    next_action character varying(255) NOT NULL,
    urgency character varying(10) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_by_id integer,
    lead_id bigint NOT NULL
);


--
-- Name: api_leadnote_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_leadnote ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_leadnote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_opportunity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_opportunity (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    stage character varying(20) NOT NULL,
    probability integer NOT NULL,
    estimated_close_date date NOT NULL,
    actual_close_date date,
    value numeric(12,2) NOT NULL,
    description text NOT NULL,
    next_steps text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    lead_id bigint NOT NULL
);


--
-- Name: api_opportunity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_opportunity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_opportunity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_opportunityactivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_opportunityactivity (
    id bigint NOT NULL,
    type character varying(20) NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone NOT NULL,
    created_by_id integer,
    opportunity_id bigint NOT NULL
);


--
-- Name: api_opportunityactivity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_opportunityactivity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_opportunityactivity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_proposaldraft; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_proposaldraft (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    validity_period character varying(10) NOT NULL,
    special_terms text NOT NULL,
    delivery_method character varying(20) NOT NULL,
    travel_frequency character varying(20) NOT NULL,
    annual_booking_volume character varying(100) NOT NULL,
    projected_spend character varying(100) NOT NULL,
    preferred_routes text NOT NULL,
    domestic_economy integer NOT NULL,
    domestic_business integer NOT NULL,
    international integer NOT NULL,
    base_discount character varying(10) NOT NULL,
    route_discounts jsonb NOT NULL,
    loyalty_benefits jsonb NOT NULL,
    volume_incentives text NOT NULL,
    contract_duration character varying(10) NOT NULL,
    auto_renewal boolean NOT NULL,
    payment_terms character varying(20) NOT NULL,
    settlement_type character varying(20) NOT NULL,
    airline_concessions text NOT NULL,
    corporate_commitments text NOT NULL,
    internal_notes text NOT NULL,
    priority_level character varying(20) NOT NULL,
    discount_approval_required boolean NOT NULL,
    revenue_manager_assigned character varying(100) NOT NULL,
    legal_approval_required boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    opportunity_id bigint NOT NULL,
    attachment_original_name character varying(255) NOT NULL,
    attachment_path character varying(500) NOT NULL
);


--
-- Name: api_proposaldraft_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_proposaldraft ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_proposaldraft_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_revenueforecast; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_revenueforecast (
    id bigint NOT NULL,
    period_type character varying(15) NOT NULL,
    period character varying(20) NOT NULL,
    forecasted_revenue numeric(15,2) NOT NULL,
    actual_revenue numeric(15,2),
    confidence_level integer NOT NULL,
    factors jsonb NOT NULL,
    notes text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: api_revenueforecast_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_revenueforecast ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_revenueforecast_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_supportticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_supportticket (
    id bigint NOT NULL,
    ticket_number character varying(20) NOT NULL,
    subject character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(15) NOT NULL,
    priority character varying(10) NOT NULL,
    status character varying(15) NOT NULL,
    resolution_notes text NOT NULL,
    satisfaction_rating integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    resolved_at timestamp with time zone,
    assigned_to_id integer,
    company_id bigint NOT NULL,
    contact_id bigint NOT NULL
);


--
-- Name: api_supportticket_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_supportticket ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_supportticket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_traveloffer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_traveloffer (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    offer_type character varying(20) NOT NULL,
    status character varying(15) NOT NULL,
    discount_percentage numeric(5,2),
    base_price numeric(10,2) NOT NULL,
    discounted_price numeric(10,2),
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone NOT NULL,
    terms_conditions text NOT NULL,
    bookings_count integer NOT NULL,
    revenue_generated numeric(12,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_by_id integer
);


--
-- Name: api_traveloffer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_traveloffer ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_traveloffer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: api_traveloffer_target_companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_traveloffer_target_companies (
    id bigint NOT NULL,
    traveloffer_id bigint NOT NULL,
    company_id bigint NOT NULL
);


--
-- Name: api_traveloffer_target_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.api_traveloffer_target_companies ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_traveloffer_target_companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: api_activitylog api_activitylog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_activitylog
    ADD CONSTRAINT api_activitylog_pkey PRIMARY KEY (id);


--
-- Name: api_aiconversation api_aiconversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_aiconversation
    ADD CONSTRAINT api_aiconversation_pkey PRIMARY KEY (id);


--
-- Name: api_aiconversation api_aiconversation_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_aiconversation
    ADD CONSTRAINT api_aiconversation_session_id_key UNIQUE (session_id);


--
-- Name: api_campaigntemplate api_campaigntemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_campaigntemplate
    ADD CONSTRAINT api_campaigntemplate_pkey PRIMARY KEY (id);


--
-- Name: api_company api_company_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_company
    ADD CONSTRAINT api_company_pkey PRIMARY KEY (id);


--
-- Name: api_contact api_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_pkey PRIMARY KEY (id);


--
-- Name: api_contract api_contract_contract_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contract
    ADD CONSTRAINT api_contract_contract_number_key UNIQUE (contract_number);


--
-- Name: api_contract api_contract_opportunity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contract
    ADD CONSTRAINT api_contract_opportunity_id_key UNIQUE (opportunity_id);


--
-- Name: api_contract api_contract_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contract
    ADD CONSTRAINT api_contract_pkey PRIMARY KEY (id);


--
-- Name: api_contractbreach api_contractbreach_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contractbreach
    ADD CONSTRAINT api_contractbreach_pkey PRIMARY KEY (id);


--
-- Name: api_emailcampaign api_emailcampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign
    ADD CONSTRAINT api_emailcampaign_pkey PRIMARY KEY (id);


--
-- Name: api_emailcampaign_target_leads api_emailcampaign_target_emailcampaign_id_lead_id_be87f6f2_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign_target_leads
    ADD CONSTRAINT api_emailcampaign_target_emailcampaign_id_lead_id_be87f6f2_uniq UNIQUE (emailcampaign_id, lead_id);


--
-- Name: api_emailcampaign_target_leads api_emailcampaign_target_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign_target_leads
    ADD CONSTRAINT api_emailcampaign_target_leads_pkey PRIMARY KEY (id);


--
-- Name: api_lead api_lead_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_lead
    ADD CONSTRAINT api_lead_pkey PRIMARY KEY (id);


--
-- Name: api_leadhistory api_leadhistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadhistory
    ADD CONSTRAINT api_leadhistory_pkey PRIMARY KEY (id);


--
-- Name: api_leadnote api_leadnote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadnote
    ADD CONSTRAINT api_leadnote_pkey PRIMARY KEY (id);


--
-- Name: api_opportunity api_opportunity_lead_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunity
    ADD CONSTRAINT api_opportunity_lead_id_key UNIQUE (lead_id);


--
-- Name: api_opportunity api_opportunity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunity
    ADD CONSTRAINT api_opportunity_pkey PRIMARY KEY (id);


--
-- Name: api_opportunityactivity api_opportunityactivity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunityactivity
    ADD CONSTRAINT api_opportunityactivity_pkey PRIMARY KEY (id);


--
-- Name: api_proposaldraft api_proposaldraft_opportunity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_proposaldraft
    ADD CONSTRAINT api_proposaldraft_opportunity_id_key UNIQUE (opportunity_id);


--
-- Name: api_proposaldraft api_proposaldraft_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_proposaldraft
    ADD CONSTRAINT api_proposaldraft_pkey PRIMARY KEY (id);


--
-- Name: api_revenueforecast api_revenueforecast_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_revenueforecast
    ADD CONSTRAINT api_revenueforecast_pkey PRIMARY KEY (id);


--
-- Name: api_supportticket api_supportticket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_supportticket
    ADD CONSTRAINT api_supportticket_pkey PRIMARY KEY (id);


--
-- Name: api_supportticket api_supportticket_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_supportticket
    ADD CONSTRAINT api_supportticket_ticket_number_key UNIQUE (ticket_number);


--
-- Name: api_traveloffer api_traveloffer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer
    ADD CONSTRAINT api_traveloffer_pkey PRIMARY KEY (id);


--
-- Name: api_traveloffer_target_companies api_traveloffer_target_c_traveloffer_id_company_i_79bd13d8_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer_target_companies
    ADD CONSTRAINT api_traveloffer_target_c_traveloffer_id_company_i_79bd13d8_uniq UNIQUE (traveloffer_id, company_id);


--
-- Name: api_traveloffer_target_companies api_traveloffer_target_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer_target_companies
    ADD CONSTRAINT api_traveloffer_target_companies_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: api_activitylog_user_id_460724d0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_activitylog_user_id_460724d0 ON public.api_activitylog USING btree (user_id);


--
-- Name: api_aiconversation_user_id_1a71143d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_aiconversation_user_id_1a71143d ON public.api_aiconversation USING btree (user_id);


--
-- Name: api_contact_company_id_f4d09d00; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_contact_company_id_f4d09d00 ON public.api_contact USING btree (company_id);


--
-- Name: api_contract_company_id_e37b23ce; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_contract_company_id_e37b23ce ON public.api_contract USING btree (company_id);


--
-- Name: api_contract_contract_number_f1accfc0_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_contract_contract_number_f1accfc0_like ON public.api_contract USING btree (contract_number varchar_pattern_ops);


--
-- Name: api_contractbreach_contract_id_27a736ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_contractbreach_contract_id_27a736ec ON public.api_contractbreach USING btree (contract_id);


--
-- Name: api_emailcampaign_target_leads_emailcampaign_id_214b3ace; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_emailcampaign_target_leads_emailcampaign_id_214b3ace ON public.api_emailcampaign_target_leads USING btree (emailcampaign_id);


--
-- Name: api_emailcampaign_target_leads_lead_id_5af85417; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_emailcampaign_target_leads_lead_id_5af85417 ON public.api_emailcampaign_target_leads USING btree (lead_id);


--
-- Name: api_emailcampaign_template_id_3c213a84; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_emailcampaign_template_id_3c213a84 ON public.api_emailcampaign USING btree (template_id);


--
-- Name: api_lead_assigned_to_id_f0f68950; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_lead_assigned_to_id_f0f68950 ON public.api_lead USING btree (assigned_to_id);


--
-- Name: api_lead_company_id_be70c00a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_lead_company_id_be70c00a ON public.api_lead USING btree (company_id);


--
-- Name: api_lead_contact_id_dc816d20; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_lead_contact_id_dc816d20 ON public.api_lead USING btree (contact_id);


--
-- Name: api_leadhistory_lead_id_7e0a62f4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_leadhistory_lead_id_7e0a62f4 ON public.api_leadhistory USING btree (lead_id);


--
-- Name: api_leadhistory_user_id_ecc34f8a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_leadhistory_user_id_ecc34f8a ON public.api_leadhistory USING btree (user_id);


--
-- Name: api_leadnote_created_by_id_1d483ee9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_leadnote_created_by_id_1d483ee9 ON public.api_leadnote USING btree (created_by_id);


--
-- Name: api_leadnote_lead_id_b0673144; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_leadnote_lead_id_b0673144 ON public.api_leadnote USING btree (lead_id);


--
-- Name: api_opportunityactivity_created_by_id_145d5cd4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_opportunityactivity_created_by_id_145d5cd4 ON public.api_opportunityactivity USING btree (created_by_id);


--
-- Name: api_opportunityactivity_opportunity_id_4ca456a3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_opportunityactivity_opportunity_id_4ca456a3 ON public.api_opportunityactivity USING btree (opportunity_id);


--
-- Name: api_supportticket_assigned_to_id_58ef3c94; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_supportticket_assigned_to_id_58ef3c94 ON public.api_supportticket USING btree (assigned_to_id);


--
-- Name: api_supportticket_company_id_37091f98; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_supportticket_company_id_37091f98 ON public.api_supportticket USING btree (company_id);


--
-- Name: api_supportticket_contact_id_f88e966f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_supportticket_contact_id_f88e966f ON public.api_supportticket USING btree (contact_id);


--
-- Name: api_supportticket_ticket_number_e2907423_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_supportticket_ticket_number_e2907423_like ON public.api_supportticket USING btree (ticket_number varchar_pattern_ops);


--
-- Name: api_traveloffer_created_by_id_8302f089; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_traveloffer_created_by_id_8302f089 ON public.api_traveloffer USING btree (created_by_id);


--
-- Name: api_traveloffer_target_companies_company_id_b7ac8b17; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_traveloffer_target_companies_company_id_b7ac8b17 ON public.api_traveloffer_target_companies USING btree (company_id);


--
-- Name: api_traveloffer_target_companies_traveloffer_id_f5ff6ed7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_traveloffer_target_companies_traveloffer_id_f5ff6ed7 ON public.api_traveloffer_target_companies USING btree (traveloffer_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: api_activitylog api_activitylog_user_id_460724d0_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_activitylog
    ADD CONSTRAINT api_activitylog_user_id_460724d0_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_aiconversation api_aiconversation_user_id_1a71143d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_aiconversation
    ADD CONSTRAINT api_aiconversation_user_id_1a71143d_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_contact api_contact_company_id_f4d09d00_fk_api_company_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_company_id_f4d09d00_fk_api_company_id FOREIGN KEY (company_id) REFERENCES public.api_company(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_contract api_contract_company_id_e37b23ce_fk_api_company_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contract
    ADD CONSTRAINT api_contract_company_id_e37b23ce_fk_api_company_id FOREIGN KEY (company_id) REFERENCES public.api_company(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_contract api_contract_opportunity_id_da447352_fk_api_opportunity_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contract
    ADD CONSTRAINT api_contract_opportunity_id_da447352_fk_api_opportunity_id FOREIGN KEY (opportunity_id) REFERENCES public.api_opportunity(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_contractbreach api_contractbreach_contract_id_27a736ec_fk_api_contract_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_contractbreach
    ADD CONSTRAINT api_contractbreach_contract_id_27a736ec_fk_api_contract_id FOREIGN KEY (contract_id) REFERENCES public.api_contract(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_emailcampaign_target_leads api_emailcampaign_ta_emailcampaign_id_214b3ace_fk_api_email; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign_target_leads
    ADD CONSTRAINT api_emailcampaign_ta_emailcampaign_id_214b3ace_fk_api_email FOREIGN KEY (emailcampaign_id) REFERENCES public.api_emailcampaign(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_emailcampaign_target_leads api_emailcampaign_target_leads_lead_id_5af85417_fk_api_lead_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign_target_leads
    ADD CONSTRAINT api_emailcampaign_target_leads_lead_id_5af85417_fk_api_lead_id FOREIGN KEY (lead_id) REFERENCES public.api_lead(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_emailcampaign api_emailcampaign_template_id_3c213a84_fk_api_campa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_emailcampaign
    ADD CONSTRAINT api_emailcampaign_template_id_3c213a84_fk_api_campa FOREIGN KEY (template_id) REFERENCES public.api_campaigntemplate(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_lead api_lead_assigned_to_id_f0f68950_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_lead
    ADD CONSTRAINT api_lead_assigned_to_id_f0f68950_fk_auth_user_id FOREIGN KEY (assigned_to_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_lead api_lead_company_id_be70c00a_fk_api_company_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_lead
    ADD CONSTRAINT api_lead_company_id_be70c00a_fk_api_company_id FOREIGN KEY (company_id) REFERENCES public.api_company(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_lead api_lead_contact_id_dc816d20_fk_api_contact_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_lead
    ADD CONSTRAINT api_lead_contact_id_dc816d20_fk_api_contact_id FOREIGN KEY (contact_id) REFERENCES public.api_contact(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_leadhistory api_leadhistory_lead_id_7e0a62f4_fk_api_lead_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadhistory
    ADD CONSTRAINT api_leadhistory_lead_id_7e0a62f4_fk_api_lead_id FOREIGN KEY (lead_id) REFERENCES public.api_lead(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_leadhistory api_leadhistory_user_id_ecc34f8a_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadhistory
    ADD CONSTRAINT api_leadhistory_user_id_ecc34f8a_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_leadnote api_leadnote_created_by_id_1d483ee9_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadnote
    ADD CONSTRAINT api_leadnote_created_by_id_1d483ee9_fk_auth_user_id FOREIGN KEY (created_by_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_leadnote api_leadnote_lead_id_b0673144_fk_api_lead_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_leadnote
    ADD CONSTRAINT api_leadnote_lead_id_b0673144_fk_api_lead_id FOREIGN KEY (lead_id) REFERENCES public.api_lead(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_opportunity api_opportunity_lead_id_18545556_fk_api_lead_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunity
    ADD CONSTRAINT api_opportunity_lead_id_18545556_fk_api_lead_id FOREIGN KEY (lead_id) REFERENCES public.api_lead(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_opportunityactivity api_opportunityactiv_opportunity_id_4ca456a3_fk_api_oppor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunityactivity
    ADD CONSTRAINT api_opportunityactiv_opportunity_id_4ca456a3_fk_api_oppor FOREIGN KEY (opportunity_id) REFERENCES public.api_opportunity(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_opportunityactivity api_opportunityactivity_created_by_id_145d5cd4_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_opportunityactivity
    ADD CONSTRAINT api_opportunityactivity_created_by_id_145d5cd4_fk_auth_user_id FOREIGN KEY (created_by_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_proposaldraft api_proposaldraft_opportunity_id_fd7fb498_fk_api_opportunity_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_proposaldraft
    ADD CONSTRAINT api_proposaldraft_opportunity_id_fd7fb498_fk_api_opportunity_id FOREIGN KEY (opportunity_id) REFERENCES public.api_opportunity(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_supportticket api_supportticket_assigned_to_id_58ef3c94_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_supportticket
    ADD CONSTRAINT api_supportticket_assigned_to_id_58ef3c94_fk_auth_user_id FOREIGN KEY (assigned_to_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_supportticket api_supportticket_company_id_37091f98_fk_api_company_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_supportticket
    ADD CONSTRAINT api_supportticket_company_id_37091f98_fk_api_company_id FOREIGN KEY (company_id) REFERENCES public.api_company(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_supportticket api_supportticket_contact_id_f88e966f_fk_api_contact_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_supportticket
    ADD CONSTRAINT api_supportticket_contact_id_f88e966f_fk_api_contact_id FOREIGN KEY (contact_id) REFERENCES public.api_contact(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_traveloffer api_traveloffer_created_by_id_8302f089_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer
    ADD CONSTRAINT api_traveloffer_created_by_id_8302f089_fk_auth_user_id FOREIGN KEY (created_by_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_traveloffer_target_companies api_traveloffer_targ_company_id_b7ac8b17_fk_api_compa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer_target_companies
    ADD CONSTRAINT api_traveloffer_targ_company_id_b7ac8b17_fk_api_compa FOREIGN KEY (company_id) REFERENCES public.api_company(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_traveloffer_target_companies api_traveloffer_targ_traveloffer_id_f5ff6ed7_fk_api_trave; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_traveloffer_target_companies
    ADD CONSTRAINT api_traveloffer_targ_traveloffer_id_f5ff6ed7_fk_api_trave FOREIGN KEY (traveloffer_id) REFERENCES public.api_traveloffer(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

