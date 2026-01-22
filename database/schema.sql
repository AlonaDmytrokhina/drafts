--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2026-01-22 16:30:28

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
-- TOC entry 229 (class 1255 OID 17078)
-- Name: increment_fanfic_words_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_fanfic_words_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_words INTEGER;
BEGIN
  new_words :=
    array_length(
      regexp_split_to_array(NEW.content, '\s+'),
      1
    );

  UPDATE fanfics
  SET
    words_count = COALESCE(words_count, 0) + new_words,
    updated_at = now()
  WHERE id = NEW.fanfic_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.increment_fanfic_words_count() OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 17076)
-- Name: update_fanfic_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_fanfic_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE fanfics
  SET updated_at = now()
  WHERE id = NEW.fanfic_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_fanfic_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16919)
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    user_id integer NOT NULL,
    fanfic_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16883)
-- Name: chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    fanfic_id integer NOT NULL,
    title character varying(255),
    content text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.chapters OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16882)
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chapters_id_seq OWNER TO postgres;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 221
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- TOC entry 224 (class 1259 OID 16900)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    chapter_id integer
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16899)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 223
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 217 (class 1259 OID 16839)
-- Name: fanfics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fanfics (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    summary text,
    language character varying(50),
    image_url text,
    words_count integer,
    rating character varying(20),
    status character varying(20),
    warnings character varying(50),
    author_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pages integer GENERATED ALWAYS AS (ceiling(((COALESCE(words_count, 0))::numeric / 250.0))) STORED,
    CONSTRAINT fanfics_rating_check CHECK (((rating)::text = ANY ((ARRAY['General'::character varying, 'Teen'::character varying, 'Mature'::character varying, 'Explicit'::character varying])::text[]))),
    CONSTRAINT fanfics_status_check CHECK (((status)::text = ANY ((ARRAY['Ongoing'::character varying, 'Completed'::character varying, 'Freezed'::character varying])::text[]))),
    CONSTRAINT fanfics_warnings_check CHECK (((warnings)::text = ANY ((ARRAY['No Warnings'::character varying, 'Violence'::character varying, 'Character Death'::character varying])::text[]))),
    CONSTRAINT fanfics_words_count_check CHECK ((words_count >= 0))
);


ALTER TABLE public.fanfics OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16838)
-- Name: fanfics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fanfics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fanfics_id_seq OWNER TO postgres;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 216
-- Name: fanfics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fanfics_id_seq OWNED BY public.fanfics.id;


--
-- TOC entry 220 (class 1259 OID 16867)
-- Name: fanfics_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fanfics_tags (
    fanfic_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.fanfics_tags OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16935)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    user_id integer NOT NULL,
    fanfic_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16951)
-- Name: reading_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reading_history (
    user_id integer NOT NULL,
    fanfic_id integer NOT NULL,
    chapter_id integer,
    read_time integer,
    last_read_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reading_history_read_time_check CHECK ((read_time >= 0))
);


ALTER TABLE public.reading_history OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16858)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(20),
    CONSTRAINT tags_type_check CHECK (((type)::text = ANY ((ARRAY['Fandom'::character varying, 'Category'::character varying, 'Character'::character varying, 'Relationship'::character varying, 'Additional'::character varying])::text[])))
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16857)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 218
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 215 (class 1259 OID 16824)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    avatar_url text,
    bio text,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16823)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3219 (class 2604 OID 16886)
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- TOC entry 3221 (class 2604 OID 16903)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3214 (class 2604 OID 16842)
-- Name: fanfics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics ALTER COLUMN id SET DEFAULT nextval('public.fanfics_id_seq'::regclass);


--
-- TOC entry 3218 (class 2604 OID 16861)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 3211 (class 2604 OID 16827)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3264 (class 2606 OID 16924)
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (user_id, fanfic_id);


--
-- TOC entry 3256 (class 2606 OID 16893)
-- Name: chapters chapters_fanfic_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_fanfic_id_position_key UNIQUE (fanfic_id, "position");


--
-- TOC entry 3258 (class 2606 OID 16891)
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16908)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 16851)
-- Name: fanfics fanfics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics
    ADD CONSTRAINT fanfics_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 16871)
-- Name: fanfics_tags fanfics_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics_tags
    ADD CONSTRAINT fanfics_tags_pkey PRIMARY KEY (fanfic_id, tag_id);


--
-- TOC entry 3271 (class 2606 OID 16940)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (user_id, fanfic_id);


--
-- TOC entry 3276 (class 2606 OID 16957)
-- Name: reading_history reading_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_pkey PRIMARY KEY (user_id, fanfic_id);


--
-- TOC entry 3247 (class 2606 OID 16866)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 3250 (class 2606 OID 16864)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 16837)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3237 (class 2606 OID 16833)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 16835)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3265 (class 1259 OID 16986)
-- Name: idx_bookmarks_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookmarks_user ON public.bookmarks USING btree (user_id);


--
-- TOC entry 3259 (class 1259 OID 16981)
-- Name: idx_chapters_fanfic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapters_fanfic ON public.chapters USING btree (fanfic_id);


--
-- TOC entry 3262 (class 1259 OID 16983)
-- Name: idx_comments_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_user ON public.comments USING btree (user_id);


--
-- TOC entry 3242 (class 1259 OID 16975)
-- Name: idx_fanfics_author; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_author ON public.fanfics USING btree (author_id);


--
-- TOC entry 3243 (class 1259 OID 17002)
-- Name: idx_fanfics_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_created_at ON public.fanfics USING btree (created_at);


--
-- TOC entry 3244 (class 1259 OID 16977)
-- Name: idx_fanfics_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_rating ON public.fanfics USING btree (rating);


--
-- TOC entry 3245 (class 1259 OID 16976)
-- Name: idx_fanfics_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_status ON public.fanfics USING btree (status);


--
-- TOC entry 3253 (class 1259 OID 16979)
-- Name: idx_fanfics_tags_fanfic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_tags_fanfic ON public.fanfics_tags USING btree (fanfic_id);


--
-- TOC entry 3254 (class 1259 OID 16980)
-- Name: idx_fanfics_tags_tag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fanfics_tags_tag ON public.fanfics_tags USING btree (tag_id);


--
-- TOC entry 3266 (class 1259 OID 16984)
-- Name: idx_likes_fanfic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_likes_fanfic ON public.likes USING btree (fanfic_id);


--
-- TOC entry 3267 (class 1259 OID 17089)
-- Name: idx_likes_fanfic_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_likes_fanfic_id ON public.likes USING btree (fanfic_id);


--
-- TOC entry 3268 (class 1259 OID 17088)
-- Name: idx_likes_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_likes_unique ON public.likes USING btree (user_id, fanfic_id);


--
-- TOC entry 3269 (class 1259 OID 16985)
-- Name: idx_likes_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_likes_user ON public.likes USING btree (user_id);


--
-- TOC entry 3272 (class 1259 OID 16988)
-- Name: idx_reading_history_fanfic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_history_fanfic ON public.reading_history USING btree (fanfic_id);


--
-- TOC entry 3273 (class 1259 OID 17055)
-- Name: idx_reading_history_last_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_history_last_read ON public.reading_history USING btree (last_read_at);


--
-- TOC entry 3274 (class 1259 OID 16987)
-- Name: idx_reading_history_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_history_user ON public.reading_history USING btree (user_id);


--
-- TOC entry 3232 (class 1259 OID 16974)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3233 (class 1259 OID 16973)
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- TOC entry 3248 (class 1259 OID 17087)
-- Name: tags_name_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tags_name_type_idx ON public.tags USING btree (name, type);


--
-- TOC entry 3290 (class 2620 OID 17077)
-- Name: chapters trg_chapter_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_chapter_insert AFTER INSERT ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_fanfic_updated_at();


--
-- TOC entry 3291 (class 2620 OID 17079)
-- Name: chapters trg_chapter_insert_words; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_chapter_insert_words AFTER INSERT ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.increment_fanfic_words_count();


--
-- TOC entry 3283 (class 2606 OID 16930)
-- Name: bookmarks bookmarks_fanfic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_fanfic_id_fkey FOREIGN KEY (fanfic_id) REFERENCES public.fanfics(id) ON DELETE CASCADE;


--
-- TOC entry 3284 (class 2606 OID 16925)
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3280 (class 2606 OID 16894)
-- Name: chapters chapters_fanfic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_fanfic_id_fkey FOREIGN KEY (fanfic_id) REFERENCES public.fanfics(id) ON DELETE CASCADE;


--
-- TOC entry 3281 (class 2606 OID 17082)
-- Name: comments comments_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 16909)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 16852)
-- Name: fanfics fanfics_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics
    ADD CONSTRAINT fanfics_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3278 (class 2606 OID 16872)
-- Name: fanfics_tags fanfics_tags_fanfic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics_tags
    ADD CONSTRAINT fanfics_tags_fanfic_id_fkey FOREIGN KEY (fanfic_id) REFERENCES public.fanfics(id) ON DELETE CASCADE;


--
-- TOC entry 3279 (class 2606 OID 16877)
-- Name: fanfics_tags fanfics_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fanfics_tags
    ADD CONSTRAINT fanfics_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 16946)
-- Name: likes likes_fanfic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_fanfic_id_fkey FOREIGN KEY (fanfic_id) REFERENCES public.fanfics(id) ON DELETE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 16941)
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3287 (class 2606 OID 16968)
-- Name: reading_history reading_history_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE SET NULL;


--
-- TOC entry 3288 (class 2606 OID 16963)
-- Name: reading_history reading_history_fanfic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_fanfic_id_fkey FOREIGN KEY (fanfic_id) REFERENCES public.fanfics(id) ON DELETE CASCADE;


--
-- TOC entry 3289 (class 2606 OID 16958)
-- Name: reading_history reading_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_history
    ADD CONSTRAINT reading_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-01-22 16:30:28

--
-- PostgreSQL database dump complete
--

