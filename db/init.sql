-- public.etiqueta definition

-- Drop table

-- DROP TABLE public.etiqueta;

CREATE TABLE public.etiqueta (
	idetiqueta serial4 NOT NULL,
	nombre varchar(50) NOT NULL,
	CONSTRAINT etiqueta_nombre_key UNIQUE (nombre),
	CONSTRAINT etiqueta_pkey PRIMARY KEY (idetiqueta)
);


-- public.usuario definition

-- Drop table

-- DROP TABLE public.usuario;

CREATE TABLE public.usuario (
	idusuario serial4 NOT NULL,
	nombre varchar(100) NOT NULL,
	mail varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	estado varchar(50) DEFAULT 'activo'::character varying NULL,
	rol varchar(50) DEFAULT 'usuario'::character varying NULL,
	fotoperfil varchar(255) NULL,
	CONSTRAINT usuario_mail_key UNIQUE (mail),
	CONSTRAINT usuario_pkey PRIMARY KEY (idusuario)
);


-- public.coleccion definition

-- Drop table

-- DROP TABLE public.coleccion;

CREATE TABLE public.coleccion (
	idcoleccion serial4 NOT NULL,
	idusuario_fk int4 NOT NULL,
	nombre varchar(100) NOT NULL,
	esfavorito bool DEFAULT false NULL,
	CONSTRAINT coleccion_pkey PRIMARY KEY (idcoleccion),
	CONSTRAINT fk_usuario_coleccion FOREIGN KEY (idusuario_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);


-- public.mensaje definition

-- Drop table

-- DROP TABLE public.mensaje;

CREATE TABLE public.mensaje (
	idmensaje serial4 NOT NULL,
	idusuarioem_fk int4 NOT NULL,
	idusuariorec_fk int4 NOT NULL,
	texto text NOT NULL,
	fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	leido bool DEFAULT false NULL,
	CONSTRAINT mensaje_pkey PRIMARY KEY (idmensaje),
	CONSTRAINT fk_emisor FOREIGN KEY (idusuarioem_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE,
	CONSTRAINT fk_receptor FOREIGN KEY (idusuariorec_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);


-- public.publicacion definition

-- Drop table

-- DROP TABLE public.publicacion;

CREATE TABLE public.publicacion (
	idpublicacion serial4 NOT NULL,
	idusuario_fk int4 NOT NULL,
	titulo varchar(100) NOT NULL,
	descripcion text NULL,
	comentarioscerrados bool DEFAULT false NULL,
	fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT publicacion_pkey PRIMARY KEY (idpublicacion),
	CONSTRAINT fk_usuario_pub FOREIGN KEY (idusuario_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);


-- public.publicacion_etiqueta definition

-- Drop table

-- DROP TABLE public.publicacion_etiqueta;

CREATE TABLE public.publicacion_etiqueta (
	idpublicacion_fk int4 NOT NULL,
	idetiqueta_fk int4 NOT NULL,
	CONSTRAINT publicacion_etiqueta_pkey PRIMARY KEY (idpublicacion_fk, idetiqueta_fk),
	CONSTRAINT fk_etiq_pub FOREIGN KEY (idetiqueta_fk) REFERENCES public.etiqueta(idetiqueta) ON DELETE CASCADE,
	CONSTRAINT fk_pub_etiqueta FOREIGN KEY (idpublicacion_fk) REFERENCES public.publicacion(idpublicacion) ON DELETE CASCADE
);


-- public.sigue definition

-- Drop table

-- DROP TABLE public.sigue;

CREATE TABLE public.sigue (
	idseguido_fk int4 NOT NULL,
	idseguidor_fk int4 NOT NULL,
	CONSTRAINT sigue_pkey PRIMARY KEY (idseguido_fk, idseguidor_fk),
	CONSTRAINT fk_seguido FOREIGN KEY (idseguido_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE,
	CONSTRAINT fk_seguidor FOREIGN KEY (idseguidor_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);


-- public.coleccion_publicacion definition

-- Drop table

-- DROP TABLE public.coleccion_publicacion;

CREATE TABLE public.coleccion_publicacion (
	idcoleccion_fk int4 NOT NULL,
	idpublicacion_fk int4 NOT NULL,
	fecha_guardado timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT coleccion_publicacion_pkey PRIMARY KEY (idcoleccion_fk, idpublicacion_fk),
	CONSTRAINT fk_cp_coleccion FOREIGN KEY (idcoleccion_fk) REFERENCES public.coleccion(idcoleccion) ON DELETE CASCADE,
	CONSTRAINT fk_cp_publicacion FOREIGN KEY (idpublicacion_fk) REFERENCES public.publicacion(idpublicacion) ON DELETE CASCADE
);


-- public.foto definition

-- Drop table

-- DROP TABLE public.foto;

CREATE TABLE public.foto (
	idfoto serial4 NOT NULL,
	idpublicacion_fk int4 NOT NULL,
	ruta varchar(255) NOT NULL,
	copyright varchar(100) NULL,
	marcaagua bool DEFAULT false NULL,
	CONSTRAINT foto_pkey PRIMARY KEY (idfoto),
	CONSTRAINT fk_publicacion_foto FOREIGN KEY (idpublicacion_fk) REFERENCES public.publicacion(idpublicacion) ON DELETE CASCADE
);


-- public.valora definition

-- Drop table

-- DROP TABLE public.valora;

CREATE TABLE public.valora (
	idusuario_fk int4 NOT NULL,
	idfoto_fk int4 NOT NULL,
	puntaje int4 NULL,
	CONSTRAINT valora_pkey PRIMARY KEY (idusuario_fk, idfoto_fk),
	CONSTRAINT valora_puntaje_check CHECK (((puntaje >= 1) AND (puntaje <= 5))),
	CONSTRAINT fk_foto_valora FOREIGN KEY (idfoto_fk) REFERENCES public.foto(idfoto) ON DELETE CASCADE,
	CONSTRAINT fk_usuario_valora FOREIGN KEY (idusuario_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);


-- public.comentario definition

-- Drop table

-- DROP TABLE public.comentario;

CREATE TABLE public.comentario (
	idcomentario serial4 NOT NULL,
	idfoto_fk int4 NOT NULL,
	idusuario_fk int4 NOT NULL,
	texto text NOT NULL,
	fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT comentario_pkey PRIMARY KEY (idcomentario),
	CONSTRAINT fk_foto_coment FOREIGN KEY (idfoto_fk) REFERENCES public.foto(idfoto) ON DELETE CASCADE,
	CONSTRAINT fk_usuario_coment FOREIGN KEY (idusuario_fk) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);