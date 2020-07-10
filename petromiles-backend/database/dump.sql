--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Ubuntu 12.3-1.pgdg18.04+1)
-- Dumped by pg_dump version 12.3 (Ubuntu 12.3-1.pgdg18.04+1)

-- Started on 2020-06-29 12:33:59 -04

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

--
-- TOC entry 771 (class 1247 OID 102383)
-- Name: client_bank_account_paymentprovider_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.client_bank_account_paymentprovider_enum AS ENUM (
    'STRIPE'
);


ALTER TYPE public.client_bank_account_paymentprovider_enum OWNER TO postgres;

--
-- TOC entry 808 (class 1247 OID 102466)
-- Name: task_name_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_name_enum AS ENUM (
    'BANK_ACCOUNT_STATUS_STRIPE',
    'TRANSACTION_CHARGE_STATUS_STRIPE',
    'TRANSACTION_TRANSFER_STATUS_STRIPE'
);


ALTER TYPE public.task_name_enum OWNER TO postgres;

--
-- TOC entry 711 (class 1247 OID 102244)
-- Name: third_party_interest_paymentprovider_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.third_party_interest_paymentprovider_enum AS ENUM (
    'STRIPE'
);


ALTER TYPE public.third_party_interest_paymentprovider_enum OWNER TO postgres;

--
-- TOC entry 708 (class 1247 OID 102233)
-- Name: third_party_interest_transactiontype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.third_party_interest_transactiontype_enum AS ENUM (
    'subscriptionPayment',
    'deposit',
    'withdrawal',
    'bankAccountValidation',
    'thirdPartyClient'
);


ALTER TYPE public.third_party_interest_transactiontype_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 102195)
-- Name: bank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank (
    "idBank" integer NOT NULL,
    name character varying NOT NULL,
    photo character varying NOT NULL,
    fk_country integer
);


ALTER TABLE public.bank OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 102173)
-- Name: bank_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_account (
    "idBankAccount" integer NOT NULL,
    "accountNumber" character varying NOT NULL,
    "checkNumber" character varying NOT NULL,
    nickname character varying NOT NULL,
    type character varying NOT NULL,
    fk_person_details integer,
    fk_routing_number integer NOT NULL
);


ALTER TABLE public.bank_account OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 102171)
-- Name: bank_account_idBankAccount_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."bank_account_idBankAccount_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."bank_account_idBankAccount_seq" OWNER TO postgres;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 205
-- Name: bank_account_idBankAccount_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."bank_account_idBankAccount_seq" OWNED BY public.bank_account."idBankAccount";


--
-- TOC entry 209 (class 1259 OID 102193)
-- Name: bank_idBank_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."bank_idBank_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."bank_idBank_seq" OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 209
-- Name: bank_idBank_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."bank_idBank_seq" OWNED BY public.bank."idBank";


--
-- TOC entry 240 (class 1259 OID 102387)
-- Name: client_bank_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_bank_account (
    "idClientBankAccount" integer NOT NULL,
    "paymentProvider" public.client_bank_account_paymentprovider_enum NOT NULL,
    "chargeId" character varying,
    "primary" boolean DEFAULT false,
    "transferId" character varying,
    fk_user_client integer NOT NULL,
    fk_bank_account integer NOT NULL
);


ALTER TABLE public.client_bank_account OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 102385)
-- Name: client_bank_account_idClientBankAccount_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."client_bank_account_idClientBankAccount_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."client_bank_account_idClientBankAccount_seq" OWNER TO postgres;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 239
-- Name: client_bank_account_idClientBankAccount_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."client_bank_account_idClientBankAccount_seq" OWNED BY public.client_bank_account."idClientBankAccount";


--
-- TOC entry 226 (class 1259 OID 102305)
-- Name: client_on_third_party; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_on_third_party (
    "idClientOnThirdParty" integer NOT NULL,
    code character varying NOT NULL,
    "expirationDate" timestamp without time zone DEFAULT ('2020-06-29 12:32:47.444788'::timestamp without time zone + '01:00:00'::interval) NOT NULL,
    fk_third_party_client integer NOT NULL,
    fk_user_client integer NOT NULL
);


ALTER TABLE public.client_on_third_party OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 102303)
-- Name: client_on_third_party_idClientOnThirdParty_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."client_on_third_party_idClientOnThirdParty_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."client_on_third_party_idClientOnThirdParty_seq" OWNER TO postgres;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 225
-- Name: client_on_third_party_idClientOnThirdParty_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."client_on_third_party_idClientOnThirdParty_seq" OWNED BY public.client_on_third_party."idClientOnThirdParty";


--
-- TOC entry 222 (class 1259 OID 102285)
-- Name: points_conversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.points_conversion (
    "idPointsConversion" integer NOT NULL,
    "onePointEqualsDollars" numeric(10,5) NOT NULL,
    "initialDate" timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    "finalDate" timestamp without time zone
);


ALTER TABLE public.points_conversion OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 102411)
-- Name: state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state (
    "idState" integer NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.state OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 102273)
-- Name: state_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state_transaction (
    "idStateTransaction" integer NOT NULL,
    "initialDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finalDate" timestamp without time zone,
    description character varying,
    fk_state integer NOT NULL,
    fk_transaction integer NOT NULL
);


ALTER TABLE public.state_transaction OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 102317)
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    "idTransaction" integer NOT NULL,
    "initialDate" timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    "rawAmount" numeric(12,3) NOT NULL,
    "totalAmountWithInterest" numeric(12,3) NOT NULL,
    type character varying NOT NULL,
    operation integer,
    "paymentProviderTransactionId" character varying,
    fk_transaction integer,
    fk_points_conversion integer NOT NULL,
    fk_client_bank_account integer,
    fk_client_on_third_party integer
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 102371)
-- Name: user_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_client (
    "idUserClient" integer NOT NULL,
    salt character varying,
    "googleToken" character varying,
    "facebookToken" character varying,
    email character varying NOT NULL,
    password character varying
);


ALTER TABLE public.user_client OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 102656)
-- Name: client_points; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.client_points AS
 SELECT "userClient".email,
    (sum((transaction."rawAmount" * (transaction.operation)::numeric)) / (100)::numeric) AS dollars,
    (sum(((transaction."rawAmount" * (transaction.operation)::numeric) / "pointsConversion"."onePointEqualsDollars")) / (100)::numeric) AS points
   FROM ((((((public.transaction transaction
     LEFT JOIN public.client_on_third_party "clientOnThirdParty" ON (("clientOnThirdParty"."idClientOnThirdParty" = transaction.fk_client_on_third_party)))
     LEFT JOIN public.client_bank_account "clientBankAccount" ON (("clientBankAccount"."idClientBankAccount" = transaction.fk_client_bank_account)))
     LEFT JOIN public.user_client "userClient" ON ((("userClient"."idUserClient" = "clientBankAccount".fk_user_client) OR ("userClient"."idUserClient" = "clientOnThirdParty".fk_user_client))))
     LEFT JOIN public.state_transaction "stateTransaction" ON (("stateTransaction".fk_transaction = transaction."idTransaction")))
     LEFT JOIN public.state state ON ((state."idState" = "stateTransaction".fk_state)))
     LEFT JOIN public.points_conversion "pointsConversion" ON (("pointsConversion"."idPointsConversion" = transaction.fk_points_conversion)))
  WHERE (((state.name)::text = 'valid'::text) AND (((transaction.type)::text = 'deposit'::text) OR ((transaction.type)::text = 'withdrawal'::text) OR ((transaction.type)::text = 'thirdPartyClient'::text)))
  GROUP BY "userClient".email;


ALTER TABLE public.client_points OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 102206)
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    "idCountry" integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 102204)
-- Name: country_idCountry_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."country_idCountry_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."country_idCountry_seq" OWNER TO postgres;

--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 211
-- Name: country_idCountry_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."country_idCountry_seq" OWNED BY public.country."idCountry";


--
-- TOC entry 204 (class 1259 OID 102162)
-- Name: language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language (
    "idLanguage" integer NOT NULL,
    name character varying NOT NULL,
    shortname character varying NOT NULL
);


ALTER TABLE public.language OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 102160)
-- Name: language_idLanguage_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."language_idLanguage_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."language_idLanguage_seq" OWNER TO postgres;

--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 203
-- Name: language_idLanguage_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."language_idLanguage_seq" OWNED BY public.language."idLanguage";


--
-- TOC entry 232 (class 1259 OID 102337)
-- Name: platform_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_interest (
    "idPlatformInterest" integer NOT NULL,
    name character varying NOT NULL,
    amount character varying,
    percentage character varying,
    "initialDate" timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    "finalDate" timestamp without time zone,
    fk_suscription integer
);


ALTER TABLE public.platform_interest OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 102335)
-- Name: platform_interest_idPlatformInterest_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."platform_interest_idPlatformInterest_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."platform_interest_idPlatformInterest_seq" OWNER TO postgres;

--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 231
-- Name: platform_interest_idPlatformInterest_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."platform_interest_idPlatformInterest_seq" OWNED BY public.platform_interest."idPlatformInterest";


--
-- TOC entry 221 (class 1259 OID 102283)
-- Name: points_conversion_idPointsConversion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."points_conversion_idPointsConversion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."points_conversion_idPointsConversion_seq" OWNER TO postgres;

--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 221
-- Name: points_conversion_idPointsConversion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."points_conversion_idPointsConversion_seq" OWNED BY public.points_conversion."idPointsConversion";


--
-- TOC entry 218 (class 1259 OID 102261)
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    "idPromotion" integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    "isADiscount" character varying,
    token character varying NOT NULL,
    amount numeric(8,2),
    percentage numeric(6,2),
    "initialDate" timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    "finalDate" timestamp without time zone
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 102259)
-- Name: promotion_idPromotion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."promotion_idPromotion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."promotion_idPromotion_seq" OWNER TO postgres;

--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 217
-- Name: promotion_idPromotion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."promotion_idPromotion_seq" OWNED BY public.promotion."idPromotion";


--
-- TOC entry 252 (class 1259 OID 102454)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    "idRole" integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 102452)
-- Name: role_idRole_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."role_idRole_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."role_idRole_seq" OWNER TO postgres;

--
-- TOC entry 3366 (class 0 OID 0)
-- Dependencies: 251
-- Name: role_idRole_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."role_idRole_seq" OWNED BY public.role."idRole";


--
-- TOC entry 208 (class 1259 OID 102184)
-- Name: routing_number; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routing_number (
    "idRoutingNumber" integer NOT NULL,
    number character varying NOT NULL,
    fk_bank integer NOT NULL
);


ALTER TABLE public.routing_number OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 102182)
-- Name: routing_number_idRoutingNumber_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."routing_number_idRoutingNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."routing_number_idRoutingNumber_seq" OWNER TO postgres;

--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 207
-- Name: routing_number_idRoutingNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."routing_number_idRoutingNumber_seq" OWNED BY public.routing_number."idRoutingNumber";


--
-- TOC entry 242 (class 1259 OID 102399)
-- Name: state_bank_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state_bank_account (
    "idStateBankAccount" integer NOT NULL,
    "initialDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finalDate" timestamp without time zone,
    description character varying,
    fk_state integer NOT NULL,
    fk_client_bank_account integer NOT NULL
);


ALTER TABLE public.state_bank_account OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 102397)
-- Name: state_bank_account_idStateBankAccount_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."state_bank_account_idStateBankAccount_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."state_bank_account_idStateBankAccount_seq" OWNER TO postgres;

--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 241
-- Name: state_bank_account_idStateBankAccount_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."state_bank_account_idStateBankAccount_seq" OWNED BY public.state_bank_account."idStateBankAccount";


--
-- TOC entry 243 (class 1259 OID 102409)
-- Name: state_idState_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."state_idState_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."state_idState_seq" OWNER TO postgres;

--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 243
-- Name: state_idState_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."state_idState_seq" OWNED BY public.state."idState";


--
-- TOC entry 219 (class 1259 OID 102271)
-- Name: state_transaction_idStateTransaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."state_transaction_idStateTransaction_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."state_transaction_idStateTransaction_seq" OWNER TO postgres;

--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 219
-- Name: state_transaction_idStateTransaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."state_transaction_idStateTransaction_seq" OWNED BY public.state_transaction."idStateTransaction";


--
-- TOC entry 246 (class 1259 OID 102422)
-- Name: state_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state_user (
    "idStateUser" integer NOT NULL,
    "initialDate" timestamp without time zone NOT NULL,
    "finalDate" timestamp without time zone,
    description character varying,
    fk_state integer NOT NULL,
    fk_user_client integer,
    fk_user_administrator integer
);


ALTER TABLE public.state_user OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 102420)
-- Name: state_user_idStateUser_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."state_user_idStateUser_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."state_user_idStateUser_seq" OWNER TO postgres;

--
-- TOC entry 3371 (class 0 OID 0)
-- Dependencies: 245
-- Name: state_user_idStateUser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."state_user_idStateUser_seq" OWNED BY public.state_user."idStateUser";


--
-- TOC entry 234 (class 1259 OID 102349)
-- Name: suscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suscription (
    "idSuscription" integer NOT NULL,
    name character varying NOT NULL,
    cost integer NOT NULL,
    "upgradedAmount" integer,
    description character varying
);


ALTER TABLE public.suscription OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 102347)
-- Name: suscription_idSuscription_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."suscription_idSuscription_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."suscription_idSuscription_seq" OWNER TO postgres;

--
-- TOC entry 3372 (class 0 OID 0)
-- Dependencies: 233
-- Name: suscription_idSuscription_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."suscription_idSuscription_seq" OWNED BY public.suscription."idSuscription";


--
-- TOC entry 254 (class 1259 OID 102475)
-- Name: task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task (
    "idTask" integer NOT NULL,
    name public.task_name_enum NOT NULL,
    frequency integer NOT NULL
);


ALTER TABLE public.task OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 102473)
-- Name: task_idTask_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."task_idTask_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."task_idTask_seq" OWNER TO postgres;

--
-- TOC entry 3373 (class 0 OID 0)
-- Dependencies: 253
-- Name: task_idTask_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."task_idTask_seq" OWNED BY public.task."idTask";


--
-- TOC entry 224 (class 1259 OID 102294)
-- Name: third_party_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.third_party_client (
    "idThirdPartyClient" integer NOT NULL,
    name character varying NOT NULL,
    "apiKey" character varying NOT NULL,
    "accumulatePercentage" character varying NOT NULL
);


ALTER TABLE public.third_party_client OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 102292)
-- Name: third_party_client_idThirdPartyClient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."third_party_client_idThirdPartyClient_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."third_party_client_idThirdPartyClient_seq" OWNER TO postgres;

--
-- TOC entry 3374 (class 0 OID 0)
-- Dependencies: 223
-- Name: third_party_client_idThirdPartyClient_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."third_party_client_idThirdPartyClient_seq" OWNED BY public.third_party_client."idThirdPartyClient";


--
-- TOC entry 216 (class 1259 OID 102249)
-- Name: third_party_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.third_party_interest (
    "idThirdPartyInterest" integer NOT NULL,
    name character varying NOT NULL,
    "transactionType" public.third_party_interest_transactiontype_enum NOT NULL,
    "paymentProvider" public.third_party_interest_paymentprovider_enum NOT NULL,
    "amountDollarCents" integer,
    percentage integer,
    "initialDate" timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    "finalDate" timestamp without time zone
);


ALTER TABLE public.third_party_interest OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 102247)
-- Name: third_party_interest_idThirdPartyInterest_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."third_party_interest_idThirdPartyInterest_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."third_party_interest_idThirdPartyInterest_seq" OWNER TO postgres;

--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 215
-- Name: third_party_interest_idThirdPartyInterest_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."third_party_interest_idThirdPartyInterest_seq" OWNED BY public.third_party_interest."idThirdPartyInterest";


--
-- TOC entry 227 (class 1259 OID 102315)
-- Name: transaction_idTransaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."transaction_idTransaction_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."transaction_idTransaction_seq" OWNER TO postgres;

--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 227
-- Name: transaction_idTransaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."transaction_idTransaction_seq" OWNED BY public.transaction."idTransaction";


--
-- TOC entry 230 (class 1259 OID 102329)
-- Name: transaction_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_interest (
    "idTransactionInterest" integer NOT NULL,
    fk_platform_interest integer,
    fk_platform_interest_extra_points integer,
    fk_third_party_interest integer,
    fk_promotion integer,
    fk_transaction integer NOT NULL
);


ALTER TABLE public.transaction_interest OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 102327)
-- Name: transaction_interest_idTransactionInterest_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."transaction_interest_idTransactionInterest_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."transaction_interest_idTransactionInterest_seq" OWNER TO postgres;

--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 229
-- Name: transaction_interest_idTransactionInterest_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."transaction_interest_idTransactionInterest_seq" OWNED BY public.transaction_interest."idTransactionInterest";


--
-- TOC entry 202 (class 1259 OID 102154)
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 102433)
-- Name: user_administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_administrator (
    "idUserAdministrator" integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    salt character varying NOT NULL,
    photo character varying
);


ALTER TABLE public.user_administrator OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 102431)
-- Name: user_administrator_idUserAdministrator_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_administrator_idUserAdministrator_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_administrator_idUserAdministrator_seq" OWNER TO postgres;

--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_administrator_idUserAdministrator_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_administrator_idUserAdministrator_seq" OWNED BY public.user_administrator."idUserAdministrator";


--
-- TOC entry 237 (class 1259 OID 102369)
-- Name: user_client_idUserClient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_client_idUserClient_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_client_idUserClient_seq" OWNER TO postgres;

--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 237
-- Name: user_client_idUserClient_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_client_idUserClient_seq" OWNED BY public.user_client."idUserClient";


--
-- TOC entry 214 (class 1259 OID 102219)
-- Name: user_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_details (
    "idUserDetails" integer NOT NULL,
    "firstName" character varying NOT NULL,
    "middleName" character varying,
    "lastName" character varying NOT NULL,
    "secondLastName" character varying,
    birthdate timestamp without time zone,
    address character varying,
    phone character varying,
    photo character varying,
    "customerId" character varying,
    "accountId" character varying,
    fk_user_client integer,
    fk_user_administrator integer,
    fk_language integer,
    fk_country integer
);


ALTER TABLE public.user_details OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 102217)
-- Name: user_details_idUserDetails_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_details_idUserDetails_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_details_idUserDetails_seq" OWNER TO postgres;

--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 213
-- Name: user_details_idUserDetails_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_details_idUserDetails_seq" OWNED BY public.user_details."idUserDetails";


--
-- TOC entry 250 (class 1259 OID 102446)
-- Name: user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role (
    "idUserRole" integer NOT NULL,
    fk_user_administrator integer,
    fk_user_client integer,
    fk_role integer NOT NULL
);


ALTER TABLE public.user_role OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 102444)
-- Name: user_role_idUserRole_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_role_idUserRole_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_role_idUserRole_seq" OWNER TO postgres;

--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_role_idUserRole_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_role_idUserRole_seq" OWNED BY public.user_role."idUserRole";


--
-- TOC entry 236 (class 1259 OID 102360)
-- Name: user_suscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_suscription (
    "idUserSuscription" integer NOT NULL,
    "initialDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "upgradedAmount" integer,
    "finalDate" timestamp without time zone,
    fk_user_client integer NOT NULL,
    fk_suscription integer NOT NULL,
    fk_transaction integer
);


ALTER TABLE public.user_suscription OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 102358)
-- Name: user_suscription_idUserSuscription_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_suscription_idUserSuscription_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_suscription_idUserSuscription_seq" OWNER TO postgres;

--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_suscription_idUserSuscription_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_suscription_idUserSuscription_seq" OWNED BY public.user_suscription."idUserSuscription";


--
-- TOC entry 3038 (class 2604 OID 102198)
-- Name: bank idBank; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank ALTER COLUMN "idBank" SET DEFAULT nextval('public."bank_idBank_seq"'::regclass);


--
-- TOC entry 3036 (class 2604 OID 102176)
-- Name: bank_account idBankAccount; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account ALTER COLUMN "idBankAccount" SET DEFAULT nextval('public."bank_account_idBankAccount_seq"'::regclass);


--
-- TOC entry 3061 (class 2604 OID 102390)
-- Name: client_bank_account idClientBankAccount; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_bank_account ALTER COLUMN "idClientBankAccount" SET DEFAULT nextval('public."client_bank_account_idClientBankAccount_seq"'::regclass);


--
-- TOC entry 3050 (class 2604 OID 102308)
-- Name: client_on_third_party idClientOnThirdParty; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_on_third_party ALTER COLUMN "idClientOnThirdParty" SET DEFAULT nextval('public."client_on_third_party_idClientOnThirdParty_seq"'::regclass);


--
-- TOC entry 3039 (class 2604 OID 102209)
-- Name: country idCountry; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN "idCountry" SET DEFAULT nextval('public."country_idCountry_seq"'::regclass);


--
-- TOC entry 3035 (class 2604 OID 102165)
-- Name: language idLanguage; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language ALTER COLUMN "idLanguage" SET DEFAULT nextval('public."language_idLanguage_seq"'::regclass);


--
-- TOC entry 3055 (class 2604 OID 102340)
-- Name: platform_interest idPlatformInterest; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_interest ALTER COLUMN "idPlatformInterest" SET DEFAULT nextval('public."platform_interest_idPlatformInterest_seq"'::regclass);


--
-- TOC entry 3047 (class 2604 OID 102288)
-- Name: points_conversion idPointsConversion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_conversion ALTER COLUMN "idPointsConversion" SET DEFAULT nextval('public."points_conversion_idPointsConversion_seq"'::regclass);


--
-- TOC entry 3043 (class 2604 OID 102264)
-- Name: promotion idPromotion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion ALTER COLUMN "idPromotion" SET DEFAULT nextval('public."promotion_idPromotion_seq"'::regclass);


--
-- TOC entry 3069 (class 2604 OID 102457)
-- Name: role idRole; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN "idRole" SET DEFAULT nextval('public."role_idRole_seq"'::regclass);


--
-- TOC entry 3037 (class 2604 OID 102187)
-- Name: routing_number idRoutingNumber; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routing_number ALTER COLUMN "idRoutingNumber" SET DEFAULT nextval('public."routing_number_idRoutingNumber_seq"'::regclass);


--
-- TOC entry 3065 (class 2604 OID 102414)
-- Name: state idState; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state ALTER COLUMN "idState" SET DEFAULT nextval('public."state_idState_seq"'::regclass);


--
-- TOC entry 3063 (class 2604 OID 102402)
-- Name: state_bank_account idStateBankAccount; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_bank_account ALTER COLUMN "idStateBankAccount" SET DEFAULT nextval('public."state_bank_account_idStateBankAccount_seq"'::regclass);


--
-- TOC entry 3045 (class 2604 OID 102276)
-- Name: state_transaction idStateTransaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_transaction ALTER COLUMN "idStateTransaction" SET DEFAULT nextval('public."state_transaction_idStateTransaction_seq"'::regclass);


--
-- TOC entry 3066 (class 2604 OID 102425)
-- Name: state_user idStateUser; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_user ALTER COLUMN "idStateUser" SET DEFAULT nextval('public."state_user_idStateUser_seq"'::regclass);


--
-- TOC entry 3057 (class 2604 OID 102352)
-- Name: suscription idSuscription; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscription ALTER COLUMN "idSuscription" SET DEFAULT nextval('public."suscription_idSuscription_seq"'::regclass);


--
-- TOC entry 3070 (class 2604 OID 102478)
-- Name: task idTask; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task ALTER COLUMN "idTask" SET DEFAULT nextval('public."task_idTask_seq"'::regclass);


--
-- TOC entry 3049 (class 2604 OID 102297)
-- Name: third_party_client idThirdPartyClient; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.third_party_client ALTER COLUMN "idThirdPartyClient" SET DEFAULT nextval('public."third_party_client_idThirdPartyClient_seq"'::regclass);


--
-- TOC entry 3041 (class 2604 OID 102252)
-- Name: third_party_interest idThirdPartyInterest; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.third_party_interest ALTER COLUMN "idThirdPartyInterest" SET DEFAULT nextval('public."third_party_interest_idThirdPartyInterest_seq"'::regclass);


--
-- TOC entry 3052 (class 2604 OID 102320)
-- Name: transaction idTransaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN "idTransaction" SET DEFAULT nextval('public."transaction_idTransaction_seq"'::regclass);


--
-- TOC entry 3054 (class 2604 OID 102332)
-- Name: transaction_interest idTransactionInterest; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest ALTER COLUMN "idTransactionInterest" SET DEFAULT nextval('public."transaction_interest_idTransactionInterest_seq"'::regclass);


--
-- TOC entry 3067 (class 2604 OID 102436)
-- Name: user_administrator idUserAdministrator; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_administrator ALTER COLUMN "idUserAdministrator" SET DEFAULT nextval('public."user_administrator_idUserAdministrator_seq"'::regclass);


--
-- TOC entry 3060 (class 2604 OID 102374)
-- Name: user_client idUserClient; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_client ALTER COLUMN "idUserClient" SET DEFAULT nextval('public."user_client_idUserClient_seq"'::regclass);


--
-- TOC entry 3040 (class 2604 OID 102222)
-- Name: user_details idUserDetails; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details ALTER COLUMN "idUserDetails" SET DEFAULT nextval('public."user_details_idUserDetails_seq"'::regclass);


--
-- TOC entry 3068 (class 2604 OID 102449)
-- Name: user_role idUserRole; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role ALTER COLUMN "idUserRole" SET DEFAULT nextval('public."user_role_idUserRole_seq"'::regclass);


--
-- TOC entry 3058 (class 2604 OID 102363)
-- Name: user_suscription idUserSuscription; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription ALTER COLUMN "idUserSuscription" SET DEFAULT nextval('public."user_suscription_idUserSuscription_seq"'::regclass);


--
-- TOC entry 3307 (class 0 OID 102195)
-- Dependencies: 210
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (1, 'Capital One Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FCapital%20One%20Bank.png?alt=media&token=aea71f5e-32e5-4d84-ac6b-74dedd626d33', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (2, 'BB&T BANK', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBB%26T%20Bank.png?alt=media&token=eb227bff-c827-4958-a1f5-4eb3aa3d778c', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (3, 'Bank of America', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (4, 'Ally Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (5, 'BBVA Compass', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBBVA%20Compass.png?alt=media&token=3505698b-55c1-42a8-b74e-ace56efb4fee', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (6, 'Citibank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FCitibank.png?alt=media&token=d8536d5e-05d1-477a-a458-0f6b42cf865d', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (7, 'USAA', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FUSAA.png?alt=media&token=ff48ffdb-7133-43ce-9861-b2b80e31e943', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (8, 'Citizens Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FCitizens%20Bank.png?alt=media&token=cdad9e9d-e321-493d-8d0e-a9b57decd326', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (9, 'Fifth Third Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FFifth%20Third%20Bank.png?alt=media&token=167bba6c-41d3-4d12-83a0-6851c516b471', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (10, 'HSBC Bank USA', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FHSBC%20Bank%20USA.png?alt=media&token=50bee238-5549-41a2-9971-564986ccab9f', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (11, 'J.P Morgan Chase Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FJ%20P%20Morgan.jpeg?alt=media&token=88d2efd7-e6dc-4162-a290-7eb8e4df077c', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (12, 'Wells Fargo Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FWells%20Fargo%20Bank.png?alt=media&token=fe95142d-2978-404e-82da-55cc0b80d3d5', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (13, 'Kinetic Credit Union', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FKinetic%20Credit%20Union.png?alt=media&token=9eb16c81-b0c8-4631-bc24-fe718de1cf88', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (14, 'KeyBank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FKey%20bank.png?alt=media&token=324eb667-a164-4336-9a16-37de1956bc54', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (15, 'US Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FUS%20Bank.png?alt=media&token=b1165ef3-7b00-4928-af58-6f2c52bdb9db', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (16, 'PNC Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FPNC%20Bank.png?alt=media&token=9d459beb-f16c-4a72-b062-9dea1ad317e0', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (17, 'Navy Federal Credit Union', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FKey%20bank.png?alt=media&token=324eb667-a164-4336-9a16-37de1956bc54', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (18, 'Regions Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FRegions%20Bank.png?alt=media&token=983bfe45-3e32-4a74-83d7-02f96de4712a', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (19, 'Sun Trust Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FSunTrust%20Bank.png?alt=media&token=d3032d08-50e1-4d4e-bbe0-54d0e84bad79', 1);
INSERT INTO public.bank ("idBank", name, photo, fk_country) VALUES (20, 'TD Bank', 'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FUS%20Bank.png?alt=media&token=b1165ef3-7b00-4928-af58-6f2c52bdb9db', 1);


--
-- TOC entry 3303 (class 0 OID 102173)
-- Dependencies: 206
-- Data for Name: bank_account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3337 (class 0 OID 102387)
-- Dependencies: 240
-- Data for Name: client_bank_account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3323 (class 0 OID 102305)
-- Dependencies: 226
-- Data for Name: client_on_third_party; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3309 (class 0 OID 102206)
-- Dependencies: 212
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.country ("idCountry", name) VALUES (1, 'UNITED STATES');
INSERT INTO public.country ("idCountry", name) VALUES (2, 'VENEZUELA');


--
-- TOC entry 3301 (class 0 OID 102162)
-- Dependencies: 204
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.language ("idLanguage", name, shortname) VALUES (1, 'english', 'en');
INSERT INTO public.language ("idLanguage", name, shortname) VALUES (2, 'spanish', 'es');


--
-- TOC entry 3329 (class 0 OID 102337)
-- Dependencies: 232
-- Data for Name: platform_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.platform_interest ("idPlatformInterest", name, amount, percentage, "initialDate", "finalDate", fk_suscription) VALUES (1, 'premium', NULL, '0.20', '2020-06-29 00:00:00', NULL, NULL);
INSERT INTO public.platform_interest ("idPlatformInterest", name, amount, percentage, "initialDate", "finalDate", fk_suscription) VALUES (2, 'gold', '500', '0.2', '2020-06-29 00:00:00', NULL, NULL);
INSERT INTO public.platform_interest ("idPlatformInterest", name, amount, percentage, "initialDate", "finalDate", fk_suscription) VALUES (3, 'verification', '250', NULL, '2020-06-29 00:00:00', NULL, NULL);
INSERT INTO public.platform_interest ("idPlatformInterest", name, amount, percentage, "initialDate", "finalDate", fk_suscription) VALUES (4, 'buy', NULL, '0.015', '2020-06-29 00:00:00', NULL, NULL);
INSERT INTO public.platform_interest ("idPlatformInterest", name, amount, percentage, "initialDate", "finalDate", fk_suscription) VALUES (5, 'Withdrawal', NULL, '0.05', '2020-06-29 00:00:00', NULL, NULL);


--
-- TOC entry 3319 (class 0 OID 102285)
-- Dependencies: 222
-- Data for Name: points_conversion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.points_conversion ("idPointsConversion", "onePointEqualsDollars", "initialDate", "finalDate") VALUES (1, 0.00200, '2020-06-29 00:00:00', NULL);


--
-- TOC entry 3315 (class 0 OID 102261)
-- Dependencies: 218
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3349 (class 0 OID 102454)
-- Dependencies: 252
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role ("idRole", name) VALUES (1, 'ADMINISTRATOR');
INSERT INTO public.role ("idRole", name) VALUES (2, 'THIRD_PARTY');
INSERT INTO public.role ("idRole", name) VALUES (3, 'CLIENT');


--
-- TOC entry 3305 (class 0 OID 102184)
-- Dependencies: 208
-- Data for Name: routing_number; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.routing_number ("idRoutingNumber", number, fk_bank) VALUES (1, '051000017', 3);
INSERT INTO public.routing_number ("idRoutingNumber", number, fk_bank) VALUES (2, '083000108', 16);
INSERT INTO public.routing_number ("idRoutingNumber", number, fk_bank) VALUES (3, '021000089', 6);
INSERT INTO public.routing_number ("idRoutingNumber", number, fk_bank) VALUES (4, '011200365', 3);
INSERT INTO public.routing_number ("idRoutingNumber", number, fk_bank) VALUES (5, '124003116', 4);


--
-- TOC entry 3341 (class 0 OID 102411)
-- Dependencies: 244
-- Data for Name: state; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.state ("idState", name, description) VALUES (1, 'active', 'This state indicates that the object is ready to be used');
INSERT INTO public.state ("idState", name, description) VALUES (2, 'verifying', 'This state indicates that the object is in the verification process');
INSERT INTO public.state ("idState", name, description) VALUES (3, 'blocked', 'This state indicates that the object has been disabled');
INSERT INTO public.state ("idState", name, description) VALUES (4, 'cancelled', 'This state indicates that the object cannot be used');
INSERT INTO public.state ("idState", name, description) VALUES (5, 'valid', 'This state indicates that the transaction has been made successful');
INSERT INTO public.state ("idState", name, description) VALUES (6, 'invalid', 'This state indicates that the transaction has not been made successful');


--
-- TOC entry 3339 (class 0 OID 102399)
-- Dependencies: 242
-- Data for Name: state_bank_account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3317 (class 0 OID 102273)
-- Dependencies: 220
-- Data for Name: state_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3343 (class 0 OID 102422)
-- Dependencies: 246
-- Data for Name: state_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3331 (class 0 OID 102349)
-- Dependencies: 234
-- Data for Name: suscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.suscription ("idSuscription", name, cost, "upgradedAmount", description) VALUES (1, 'BASIC', 0, NULL, 'Suscription initial of every new client');
INSERT INTO public.suscription ("idSuscription", name, cost, "upgradedAmount", description) VALUES (2, 'PREMIUM', 2500, NULL, 'User must to ask for this suscription');
INSERT INTO public.suscription ("idSuscription", name, cost, "upgradedAmount", description) VALUES (3, 'GOLD', 0, 15000, 'This suscription is active when the user has spend an amount greater or equal to upgraded_amount');


--
-- TOC entry 3351 (class 0 OID 102475)
-- Dependencies: 254
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.task ("idTask", name, frequency) VALUES (1, 'BANK_ACCOUNT_STATUS_STRIPE', 86400000);
INSERT INTO public.task ("idTask", name, frequency) VALUES (2, 'TRANSACTION_CHARGE_STATUS_STRIPE', 300000);
INSERT INTO public.task ("idTask", name, frequency) VALUES (3, 'TRANSACTION_TRANSFER_STATUS_STRIPE', 300000);


--
-- TOC entry 3321 (class 0 OID 102294)
-- Dependencies: 224
-- Data for Name: third_party_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.third_party_client ("idThirdPartyClient", name, "apiKey", "accumulatePercentage") VALUES (1, 'BuhoCenter', 'uLYAEka6cv', '0.25');


--
-- TOC entry 3313 (class 0 OID 102249)
-- Dependencies: 216
-- Data for Name: third_party_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.third_party_interest ("idThirdPartyInterest", name, "transactionType", "paymentProvider", "amountDollarCents", percentage, "initialDate", "finalDate") VALUES (2, 'Transaction Interest', 'withdrawal', 'STRIPE', 75, NULL, '2020-06-29 00:00:00', NULL);
INSERT INTO public.third_party_interest ("idThirdPartyInterest", name, "transactionType", "paymentProvider", "amountDollarCents", percentage, "initialDate", "finalDate") VALUES (1, 'Transaction Interest', 'deposit', 'STRIPE', 75, NULL, '2020-06-29 00:00:00', NULL);


--
-- TOC entry 3325 (class 0 OID 102317)
-- Dependencies: 228
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3327 (class 0 OID 102329)
-- Dependencies: 230
-- Data for Name: transaction_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3299 (class 0 OID 102154)
-- Dependencies: 202
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.typeorm_metadata (type, database, schema, "table", name, value) VALUES ('VIEW', NULL, 'public', NULL, 'client_points', 'SELECT "userClient"."email" AS "email", SUM("transaction"."rawAmount" * "transaction"."operation") /100 AS "dollars", SUM(("transaction"."rawAmount" * "transaction"."operation")/ "pointsConversion"."onePointEqualsDollars")/100 AS "points" FROM "transaction" "transaction" LEFT JOIN "client_on_third_party" "clientOnThirdParty" ON "clientOnThirdParty"."idClientOnThirdParty"="transaction"."fk_client_on_third_party"  LEFT JOIN "client_bank_account" "clientBankAccount" ON "clientBankAccount"."idClientBankAccount"="transaction"."fk_client_bank_account"  LEFT JOIN "user_client" "userClient" ON "userClient"."idUserClient" = "clientBankAccount".fk_user_client OR "userClient"."idUserClient" = "clientOnThirdParty".fk_user_client  LEFT JOIN "state_transaction" "stateTransaction" ON "stateTransaction"."fk_transaction"="transaction"."idTransaction"  LEFT JOIN "state" "state" ON "state"."idState"="stateTransaction"."fk_state"  LEFT JOIN "points_conversion" "pointsConversion" ON "pointsConversion"."idPointsConversion"="transaction"."fk_points_conversion" WHERE "state"."name" = ''valid'' AND ("transaction"."type" = ''deposit'' OR "transaction"."type" = ''withdrawal'' OR "transaction"."type" = ''thirdPartyClient'') GROUP BY "userClient"."email"');


--
-- TOC entry 3345 (class 0 OID 102433)
-- Dependencies: 248
-- Data for Name: user_administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3335 (class 0 OID 102371)
-- Dependencies: 238
-- Data for Name: user_client; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3311 (class 0 OID 102219)
-- Dependencies: 214
-- Data for Name: user_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3347 (class 0 OID 102446)
-- Dependencies: 250
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3333 (class 0 OID 102360)
-- Dependencies: 236
-- Data for Name: user_suscription; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 205
-- Name: bank_account_idBankAccount_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."bank_account_idBankAccount_seq"', 1, false);


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 209
-- Name: bank_idBank_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."bank_idBank_seq"', 20, true);


--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 239
-- Name: client_bank_account_idClientBankAccount_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."client_bank_account_idClientBankAccount_seq"', 1, false);


--
-- TOC entry 3386 (class 0 OID 0)
-- Dependencies: 225
-- Name: client_on_third_party_idClientOnThirdParty_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."client_on_third_party_idClientOnThirdParty_seq"', 1, false);


--
-- TOC entry 3387 (class 0 OID 0)
-- Dependencies: 211
-- Name: country_idCountry_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."country_idCountry_seq"', 2, true);


--
-- TOC entry 3388 (class 0 OID 0)
-- Dependencies: 203
-- Name: language_idLanguage_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."language_idLanguage_seq"', 2, true);


--
-- TOC entry 3389 (class 0 OID 0)
-- Dependencies: 231
-- Name: platform_interest_idPlatformInterest_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."platform_interest_idPlatformInterest_seq"', 5, true);


--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 221
-- Name: points_conversion_idPointsConversion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."points_conversion_idPointsConversion_seq"', 1, true);


--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 217
-- Name: promotion_idPromotion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."promotion_idPromotion_seq"', 1, false);


--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 251
-- Name: role_idRole_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."role_idRole_seq"', 3, true);


--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 207
-- Name: routing_number_idRoutingNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."routing_number_idRoutingNumber_seq"', 5, true);


--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 241
-- Name: state_bank_account_idStateBankAccount_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."state_bank_account_idStateBankAccount_seq"', 1, false);


--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 243
-- Name: state_idState_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."state_idState_seq"', 6, true);


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 219
-- Name: state_transaction_idStateTransaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."state_transaction_idStateTransaction_seq"', 1, false);


--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 245
-- Name: state_user_idStateUser_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."state_user_idStateUser_seq"', 1, false);


--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 233
-- Name: suscription_idSuscription_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."suscription_idSuscription_seq"', 3, true);


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 253
-- Name: task_idTask_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."task_idTask_seq"', 3, true);


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 223
-- Name: third_party_client_idThirdPartyClient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."third_party_client_idThirdPartyClient_seq"', 1, true);


--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 215
-- Name: third_party_interest_idThirdPartyInterest_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."third_party_interest_idThirdPartyInterest_seq"', 2, true);


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 227
-- Name: transaction_idTransaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."transaction_idTransaction_seq"', 1, false);


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 229
-- Name: transaction_interest_idTransactionInterest_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."transaction_interest_idTransactionInterest_seq"', 1, false);


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_administrator_idUserAdministrator_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_administrator_idUserAdministrator_seq"', 1, false);


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 237
-- Name: user_client_idUserClient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_client_idUserClient_seq"', 1, false);


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 213
-- Name: user_details_idUserDetails_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_details_idUserDetails_seq"', 1, false);


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_role_idUserRole_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_role_idUserRole_seq"', 1, false);


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_suscription_idUserSuscription_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_suscription_idUserSuscription_seq"', 1, false);


--
-- TOC entry 3126 (class 2606 OID 102441)
-- Name: user_administrator PK_0ce5ae033205e71fcb79ff2b707; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_administrator
    ADD CONSTRAINT "PK_0ce5ae033205e71fcb79ff2b707" PRIMARY KEY ("idUserAdministrator");


--
-- TOC entry 3078 (class 2606 OID 102203)
-- Name: bank PK_19f7241455456836dce5f78642d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "PK_19f7241455456836dce5f78642d" PRIMARY KEY ("idBank");


--
-- TOC entry 3132 (class 2606 OID 102462)
-- Name: role PK_1e9e35d9ab72d2ed91655d6cdf7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_1e9e35d9ab72d2ed91655d6cdf7" PRIMARY KEY ("idRole");


--
-- TOC entry 3094 (class 2606 OID 102282)
-- Name: state_transaction PK_1ec173522e5189c8d85d5a6fe8f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_transaction
    ADD CONSTRAINT "PK_1ec173522e5189c8d85d5a6fe8f" PRIMARY KEY ("idStateTransaction");


--
-- TOC entry 3120 (class 2606 OID 102408)
-- Name: state_bank_account PK_27c3aeebbbdcdf84aa7b1ad13eb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_bank_account
    ADD CONSTRAINT "PK_27c3aeebbbdcdf84aa7b1ad13eb" PRIMARY KEY ("idStateBankAccount");


--
-- TOC entry 3076 (class 2606 OID 102192)
-- Name: routing_number PK_308999976d34b66d7e4bd380c65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routing_number
    ADD CONSTRAINT "PK_308999976d34b66d7e4bd380c65" PRIMARY KEY ("idRoutingNumber");


--
-- TOC entry 3084 (class 2606 OID 102227)
-- Name: user_details PK_393407fc1076c32aa4ac9a2da87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "PK_393407fc1076c32aa4ac9a2da87" PRIMARY KEY ("idUserDetails");


--
-- TOC entry 3090 (class 2606 OID 102258)
-- Name: third_party_interest PK_3a62e0d2ccb8d12c1d6d4ff31be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.third_party_interest
    ADD CONSTRAINT "PK_3a62e0d2ccb8d12c1d6d4ff31be" PRIMARY KEY ("idThirdPartyInterest");


--
-- TOC entry 3106 (class 2606 OID 102346)
-- Name: platform_interest PK_3cd46ef30bc503511ec7c6eeaeb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_interest
    ADD CONSTRAINT "PK_3cd46ef30bc503511ec7c6eeaeb" PRIMARY KEY ("idPlatformInterest");


--
-- TOC entry 3072 (class 2606 OID 102170)
-- Name: language PK_412e304521e07f8de339159a6f1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT "PK_412e304521e07f8de339159a6f1" PRIMARY KEY ("idLanguage");


--
-- TOC entry 3096 (class 2606 OID 102291)
-- Name: points_conversion PK_47870ed624684ac2ccf489150b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_conversion
    ADD CONSTRAINT "PK_47870ed624684ac2ccf489150b7" PRIMARY KEY ("idPointsConversion");


--
-- TOC entry 3136 (class 2606 OID 102480)
-- Name: task PK_5480263e90cfba90f71a89f55c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "PK_5480263e90cfba90f71a89f55c3" PRIMARY KEY ("idTask");


--
-- TOC entry 3102 (class 2606 OID 102326)
-- Name: transaction PK_6249f8e87017c6ff506c4cfd9b6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "PK_6249f8e87017c6ff506c4cfd9b6" PRIMARY KEY ("idTransaction");


--
-- TOC entry 3074 (class 2606 OID 102181)
-- Name: bank_account PK_6d33bb995b6ad51ee1d2d414ffc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "PK_6d33bb995b6ad51ee1d2d414ffc" PRIMARY KEY ("idBankAccount");


--
-- TOC entry 3118 (class 2606 OID 102396)
-- Name: client_bank_account PK_77ea901b778956e57c3c88322e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_bank_account
    ADD CONSTRAINT "PK_77ea901b778956e57c3c88322e1" PRIMARY KEY ("idClientBankAccount");


--
-- TOC entry 3130 (class 2606 OID 102451)
-- Name: user_role PK_7a13a89da22bff1d339c81a371b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT "PK_7a13a89da22bff1d339c81a371b" PRIMARY KEY ("idUserRole");


--
-- TOC entry 3092 (class 2606 OID 102270)
-- Name: promotion PK_7b968d8dcf71468070e8a5fca4a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT "PK_7b968d8dcf71468070e8a5fca4a" PRIMARY KEY ("idPromotion");


--
-- TOC entry 3080 (class 2606 OID 102214)
-- Name: country PK_8cf52c0ff798e22137a01e8eec6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT "PK_8cf52c0ff798e22137a01e8eec6" PRIMARY KEY ("idCountry");


--
-- TOC entry 3114 (class 2606 OID 102379)
-- Name: user_client PK_99505ce94e70cf5e1026c8535b6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_client
    ADD CONSTRAINT "PK_99505ce94e70cf5e1026c8535b6" PRIMARY KEY ("idUserClient");


--
-- TOC entry 3108 (class 2606 OID 102357)
-- Name: suscription PK_bbe63c3c82106a2a780c3f553ef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscription
    ADD CONSTRAINT "PK_bbe63c3c82106a2a780c3f553ef" PRIMARY KEY ("idSuscription");


--
-- TOC entry 3122 (class 2606 OID 102419)
-- Name: state PK_c0688d2c93087057b5a753ee813; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT "PK_c0688d2c93087057b5a753ee813" PRIMARY KEY ("idState");


--
-- TOC entry 3124 (class 2606 OID 102430)
-- Name: state_user PK_d32f476de91055c483403cae097; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_user
    ADD CONSTRAINT "PK_d32f476de91055c483403cae097" PRIMARY KEY ("idStateUser");


--
-- TOC entry 3104 (class 2606 OID 102334)
-- Name: transaction_interest PK_db65bfa9fc992e479e2fd76fc62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "PK_db65bfa9fc992e479e2fd76fc62" PRIMARY KEY ("idTransactionInterest");


--
-- TOC entry 3100 (class 2606 OID 102314)
-- Name: client_on_third_party PK_e22e50c419c9d02aef04664ea69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_on_third_party
    ADD CONSTRAINT "PK_e22e50c419c9d02aef04664ea69" PRIMARY KEY ("idClientOnThirdParty");


--
-- TOC entry 3110 (class 2606 OID 102366)
-- Name: user_suscription PK_edae3c8ca36b237b55640fe9a26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription
    ADD CONSTRAINT "PK_edae3c8ca36b237b55640fe9a26" PRIMARY KEY ("idUserSuscription");


--
-- TOC entry 3098 (class 2606 OID 102302)
-- Name: third_party_client PK_f3c5eda805df9cd81f692f11bc7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.third_party_client
    ADD CONSTRAINT "PK_f3c5eda805df9cd81f692f11bc7" PRIMARY KEY ("idThirdPartyClient");


--
-- TOC entry 3112 (class 2606 OID 102368)
-- Name: user_suscription REL_423cad362e5eab97271376949f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription
    ADD CONSTRAINT "REL_423cad362e5eab97271376949f" UNIQUE (fk_transaction);


--
-- TOC entry 3086 (class 2606 OID 102231)
-- Name: user_details REL_5a42d05cec56a65730506d3590; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "REL_5a42d05cec56a65730506d3590" UNIQUE (fk_user_administrator);


--
-- TOC entry 3088 (class 2606 OID 102229)
-- Name: user_details REL_635844f69a23b6c983490a1141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "REL_635844f69a23b6c983490a1141" UNIQUE (fk_user_client);


--
-- TOC entry 3082 (class 2606 OID 102216)
-- Name: country UQ_2c5aa339240c0c3ae97fcc9dc4c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE (name);


--
-- TOC entry 3134 (class 2606 OID 102464)
-- Name: role UQ_ae4578dcaed5adff96595e61660; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);


--
-- TOC entry 3116 (class 2606 OID 102381)
-- Name: user_client UQ_b23f782f27b612c4b39d66d822b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_client
    ADD CONSTRAINT "UQ_b23f782f27b612c4b39d66d822b" UNIQUE (email);


--
-- TOC entry 3128 (class 2606 OID 102443)
-- Name: user_administrator UQ_c4168a84c053513a8af34c6cb47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_administrator
    ADD CONSTRAINT "UQ_c4168a84c053513a8af34c6cb47" UNIQUE (email);


--
-- TOC entry 3165 (class 2606 OID 102621)
-- Name: state_bank_account FK_03ee9996e30bab45db78a97c264; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_bank_account
    ADD CONSTRAINT "FK_03ee9996e30bab45db78a97c264" FOREIGN KEY (fk_client_bank_account) REFERENCES public.client_bank_account("idClientBankAccount");


--
-- TOC entry 3150 (class 2606 OID 102546)
-- Name: transaction FK_094b02bdc3923ee40a5b8d1b641; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_094b02bdc3923ee40a5b8d1b641" FOREIGN KEY (fk_points_conversion) REFERENCES public.points_conversion("idPointsConversion");


--
-- TOC entry 3169 (class 2606 OID 102641)
-- Name: user_role FK_1a481ce866e6e36de9f82d2b9a4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT "FK_1a481ce866e6e36de9f82d2b9a4" FOREIGN KEY (fk_user_administrator) REFERENCES public.user_administrator("idUserAdministrator");


--
-- TOC entry 3164 (class 2606 OID 102616)
-- Name: state_bank_account FK_1a62d539339d36929b003a2577a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_bank_account
    ADD CONSTRAINT "FK_1a62d539339d36929b003a2577a" FOREIGN KEY (fk_state) REFERENCES public.state("idState");


--
-- TOC entry 3170 (class 2606 OID 102646)
-- Name: user_role FK_1d10098fd647986ea5fd5821c25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT "FK_1d10098fd647986ea5fd5821c25" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3145 (class 2606 OID 102521)
-- Name: state_transaction FK_3a27ad6e81ab43d8f0e9076ba59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_transaction
    ADD CONSTRAINT "FK_3a27ad6e81ab43d8f0e9076ba59" FOREIGN KEY (fk_state) REFERENCES public.state("idState");


--
-- TOC entry 3143 (class 2606 OID 102511)
-- Name: user_details FK_3cec748bb33db970c7e9af56423; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "FK_3cec748bb33db970c7e9af56423" FOREIGN KEY (fk_language) REFERENCES public.language("idLanguage");


--
-- TOC entry 3153 (class 2606 OID 102561)
-- Name: transaction_interest FK_40fce0f3f9d2dc13c1fbef4fd72; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "FK_40fce0f3f9d2dc13c1fbef4fd72" FOREIGN KEY (fk_platform_interest) REFERENCES public.platform_interest("idPlatformInterest");


--
-- TOC entry 3161 (class 2606 OID 102601)
-- Name: user_suscription FK_423cad362e5eab97271376949fb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription
    ADD CONSTRAINT "FK_423cad362e5eab97271376949fb" FOREIGN KEY (fk_transaction) REFERENCES public.transaction("idTransaction");


--
-- TOC entry 3155 (class 2606 OID 102571)
-- Name: transaction_interest FK_426bd6aec77c16799150cc9a840; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "FK_426bd6aec77c16799150cc9a840" FOREIGN KEY (fk_third_party_interest) REFERENCES public.third_party_interest("idThirdPartyInterest");


--
-- TOC entry 3156 (class 2606 OID 102576)
-- Name: transaction_interest FK_48a29ecd12cd061779d8ceb828b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "FK_48a29ecd12cd061779d8ceb828b" FOREIGN KEY (fk_promotion) REFERENCES public.promotion("idPromotion");


--
-- TOC entry 3162 (class 2606 OID 102606)
-- Name: client_bank_account FK_4c11b6c9e8a8197c782ba9b4bae; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_bank_account
    ADD CONSTRAINT "FK_4c11b6c9e8a8197c782ba9b4bae" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3137 (class 2606 OID 102481)
-- Name: bank_account FK_4dae2dad90490466157df1c9e7a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "FK_4dae2dad90490466157df1c9e7a" FOREIGN KEY (fk_person_details) REFERENCES public.user_details("idUserDetails");


--
-- TOC entry 3142 (class 2606 OID 102506)
-- Name: user_details FK_5a42d05cec56a65730506d35902; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "FK_5a42d05cec56a65730506d35902" FOREIGN KEY (fk_user_administrator) REFERENCES public.user_administrator("idUserAdministrator");


--
-- TOC entry 3152 (class 2606 OID 102556)
-- Name: transaction FK_5ce438b903e4c7ddf23ccecc9f5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_5ce438b903e4c7ddf23ccecc9f5" FOREIGN KEY (fk_client_on_third_party) REFERENCES public.client_on_third_party("idClientOnThirdParty");


--
-- TOC entry 3141 (class 2606 OID 102501)
-- Name: user_details FK_635844f69a23b6c983490a11410; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "FK_635844f69a23b6c983490a11410" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3149 (class 2606 OID 102541)
-- Name: transaction FK_94b26b58999671cd37eb8669209; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_94b26b58999671cd37eb8669209" FOREIGN KEY (fk_transaction) REFERENCES public.transaction("idTransaction");


--
-- TOC entry 3167 (class 2606 OID 102631)
-- Name: state_user FK_986a8d9409c2aa75cbc0608dc5e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_user
    ADD CONSTRAINT "FK_986a8d9409c2aa75cbc0608dc5e" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3144 (class 2606 OID 102516)
-- Name: user_details FK_9abbaf1f44ff9a9a6af89f09b70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT "FK_9abbaf1f44ff9a9a6af89f09b70" FOREIGN KEY (fk_country) REFERENCES public.country("idCountry");


--
-- TOC entry 3168 (class 2606 OID 102636)
-- Name: state_user FK_acb2f9bffd29ed3ed6412dad794; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_user
    ADD CONSTRAINT "FK_acb2f9bffd29ed3ed6412dad794" FOREIGN KEY (fk_user_administrator) REFERENCES public.user_administrator("idUserAdministrator");


--
-- TOC entry 3148 (class 2606 OID 102536)
-- Name: client_on_third_party FK_b009b2b38891d051d57b1c41cd9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_on_third_party
    ADD CONSTRAINT "FK_b009b2b38891d051d57b1c41cd9" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3171 (class 2606 OID 102651)
-- Name: user_role FK_b41a83b90287b40cf003b473ff6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT "FK_b41a83b90287b40cf003b473ff6" FOREIGN KEY (fk_role) REFERENCES public.role("idRole");


--
-- TOC entry 3138 (class 2606 OID 102486)
-- Name: bank_account FK_bc75fd3ded55fb4a57df6e1c9b5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "FK_bc75fd3ded55fb4a57df6e1c9b5" FOREIGN KEY (fk_routing_number) REFERENCES public.routing_number("idRoutingNumber");


--
-- TOC entry 3147 (class 2606 OID 102531)
-- Name: client_on_third_party FK_c8ae947103f9ef27771a0f35924; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_on_third_party
    ADD CONSTRAINT "FK_c8ae947103f9ef27771a0f35924" FOREIGN KEY (fk_third_party_client) REFERENCES public.third_party_client("idThirdPartyClient");


--
-- TOC entry 3166 (class 2606 OID 102626)
-- Name: state_user FK_c9f87fe5d51f17f4f6b711e8944; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_user
    ADD CONSTRAINT "FK_c9f87fe5d51f17f4f6b711e8944" FOREIGN KEY (fk_state) REFERENCES public.state("idState");


--
-- TOC entry 3160 (class 2606 OID 102596)
-- Name: user_suscription FK_cf8b1c574a16940ac94317c3daa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription
    ADD CONSTRAINT "FK_cf8b1c574a16940ac94317c3daa" FOREIGN KEY (fk_suscription) REFERENCES public.suscription("idSuscription");


--
-- TOC entry 3157 (class 2606 OID 102581)
-- Name: transaction_interest FK_d5abfe239d811e7ed2358fe380a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "FK_d5abfe239d811e7ed2358fe380a" FOREIGN KEY (fk_transaction) REFERENCES public.transaction("idTransaction");


--
-- TOC entry 3158 (class 2606 OID 102586)
-- Name: platform_interest FK_ddabb655a2e648e0d423b05a4c0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_interest
    ADD CONSTRAINT "FK_ddabb655a2e648e0d423b05a4c0" FOREIGN KEY (fk_suscription) REFERENCES public.suscription("idSuscription");


--
-- TOC entry 3159 (class 2606 OID 102591)
-- Name: user_suscription FK_e624a0560ababd3d4540f69d023; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_suscription
    ADD CONSTRAINT "FK_e624a0560ababd3d4540f69d023" FOREIGN KEY (fk_user_client) REFERENCES public.user_client("idUserClient");


--
-- TOC entry 3163 (class 2606 OID 102611)
-- Name: client_bank_account FK_e73f16659004dd443ea27bc2436; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_bank_account
    ADD CONSTRAINT "FK_e73f16659004dd443ea27bc2436" FOREIGN KEY (fk_bank_account) REFERENCES public.bank_account("idBankAccount");


--
-- TOC entry 3151 (class 2606 OID 102551)
-- Name: transaction FK_ebd528130eff6bc8efa588dd417; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_ebd528130eff6bc8efa588dd417" FOREIGN KEY (fk_client_bank_account) REFERENCES public.client_bank_account("idClientBankAccount");


--
-- TOC entry 3139 (class 2606 OID 102491)
-- Name: routing_number FK_f2268b230452b7d85f6559fcae7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routing_number
    ADD CONSTRAINT "FK_f2268b230452b7d85f6559fcae7" FOREIGN KEY (fk_bank) REFERENCES public.bank("idBank");


--
-- TOC entry 3154 (class 2606 OID 102566)
-- Name: transaction_interest FK_f7b2ff89bea52967d6be2254c75; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interest
    ADD CONSTRAINT "FK_f7b2ff89bea52967d6be2254c75" FOREIGN KEY (fk_platform_interest_extra_points) REFERENCES public.platform_interest("idPlatformInterest");


--
-- TOC entry 3140 (class 2606 OID 102496)
-- Name: bank FK_f897971cc8dcd99a99a8a681362; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "FK_f897971cc8dcd99a99a8a681362" FOREIGN KEY (fk_country) REFERENCES public.country("idCountry");


--
-- TOC entry 3146 (class 2606 OID 102526)
-- Name: state_transaction FK_ffbd1a35675d02c3f3cda515d1a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_transaction
    ADD CONSTRAINT "FK_ffbd1a35675d02c3f3cda515d1a" FOREIGN KEY (fk_transaction) REFERENCES public.transaction("idTransaction");


-- Completed on 2020-06-29 12:33:59 -04

--
-- PostgreSQL database dump complete
--
