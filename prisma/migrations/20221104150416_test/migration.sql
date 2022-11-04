BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Anexo] (
    [IdAnexo] BIGINT NOT NULL IDENTITY(1,1),
    [Nombre] VARCHAR(250) NOT NULL,
    [Extension] VARCHAR(8),
    [Descripcion] NVARCHAR(250),
    [IdImagen] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [DF__Anexo__IdImagen__2469202D] DEFAULT newid(),
    [Imagen] VARBINARY(max),
    CONSTRAINT [PK_Anexo] PRIMARY KEY CLUSTERED ([IdAnexo]),
    CONSTRAINT [UQ__Ane__B42D8F2B14F6A844] UNIQUE NONCLUSTERED ([IdImagen])
);

-- CreateTable
CREATE TABLE [dbo].[Area_Experiencia] (
    [Codigo] INT NOT NULL,
    [Descripcion] NVARCHAR(80) NOT NULL,
    CONSTRAINT [PK_Area_Experiencia] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Companias] (
    [Codigo] INT NOT NULL,
    [Descripcion] VARCHAR(80),
    [RNC] NVARCHAR(30),
    [RNL] NVARCHAR(10),
    [No_IDSS] NVARCHAR(50),
    [Razon_Social] VARCHAR(80),
    [AnoInicio] SMALLINT,
    [NombreEmpleador] NVARCHAR(100) NOT NULL,
    [Ocupacion] NVARCHAR(80),
    [Direccion] VARCHAR(150),
    [ParqueZona] NVARCHAR(80),
    [Provincia] NVARCHAR(80),
    [Municipio] NVARCHAR(80),
    [Sector] NVARCHAR(80),
    [Poliza] NVARCHAR(30),
    [Zona_Inspeccion] NVARCHAR(20),
    [Categoria] NVARCHAR(20),
    [Delegacion] NVARCHAR(50),
    [Delegacion_De] NVARCHAR(100),
    [Telefono] NVARCHAR(40),
    [Fax] NVARCHAR(40),
    [Email] NVARCHAR(150),
    [ValorInstalaciones] DECIMAL(18,2),
    [tipo_calculo_isr] TINYINT,
    [salario_contribucion] FLOAT(53),
    [porciento_idss] FLOAT(53),
    [CUENTA_BANCARIA] NVARCHAR(40),
    [Periodo_Probatorio] INT,
    [Mensaje_General] NVARCHAR(510),
    [Sucursal] BIT,
    [ZonaFranca] BIT,
    [Volantes_Personalizados] BIT,
    [Excluir_Cheques] BIT,
    [Tipo_Interfase_Contable] TINYINT,
    [Website] NVARCHAR(150),
    [Plaza] NVARCHAR(80),
    [accion_personal_automatica] TINYINT,
    [Casa_Matriz] NVARCHAR(20),
    [Periodo_Caducidad_Usuario] DECIMAL(18,0),
    [Tipo_Secuencia] TINYINT,
    [DiasRecordatorio] SMALLINT,
    [Fecha_Calculo_Prestaciones] INT CONSTRAINT [DF_Companias_Fecha_Calculo_Prestaciones_1] DEFAULT 0,
    [DiasPorMes] FLOAT(53) CONSTRAINT [DF_Companias_DiasPorMes_1] DEFAULT 0,
    [DiasVacaciones] FLOAT(53),
    [Tipo_Reportes_Accion] TINYINT,
    [TipoInterfase_Reloj] TINYINT,
    [Permitirse_Aprobar_asimismo] INT,
    [SupervisoresGlobales] INT,
    [FormaCalculoVacaciones] TINYINT,
    [Excluir_Extranjeros_TSS] INT,
    [licencia] INT CONSTRAINT [DF__Companias__licen__0599B4F3] DEFAULT 0,
    [tipoBonificacion] INT CONSTRAINT [DF__Companias__tipoB__068DD92C] DEFAULT 0,
    [CedulaPatron] NVARCHAR(26),
    [ActualizaHoras] INT,
    [TipoPagoBonifPrestaciones] INT,
    [NoProyectarSalarioEnISR] TINYINT,
    [CierreFiscal] SMALLDATETIME CONSTRAINT [DF_Companias_CierreFiscal] DEFAULT 2012-12-31,
    [Tipo_Generacion] SMALLINT,
    [Ruta_Ftp] VARCHAR(100),
    [Ruta_Local] VARCHAR(100),
    [Posteo] VARCHAR(20),
    [Validacion] VARCHAR(20),
    [Usuario_Ftp] VARCHAR(20),
    [Contrasena_Ftp] VARCHAR(20),
    [Puerto_Ftp] SMALLINT,
    [Avance_Vacaciones] SMALLINT,
    [DiasVacacionesPago] FLOAT(53),
    [UrlVideo] NVARCHAR(200),
    [Referencia] VARCHAR(10),
    CONSTRAINT [PK_Companias] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Idiomas] (
    [Codigo] INT NOT NULL,
    [Descripcion] NVARCHAR(60),
    [HROne_Code] CHAR(3),
    CONSTRAINT [PK_Idiomas] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[MUNICIPIOS] (
    [CODIGO] INT NOT NULL,
    [DESCRIPCION] NVARCHAR(100),
    [IDPROVINCIA] INT NOT NULL,
    CONSTRAINT [PK_MUNICIPIOS] PRIMARY KEY CLUSTERED ([CODIGO])
);

-- CreateTable
CREATE TABLE [dbo].[Nacionalidades] (
    [Codigo] INT NOT NULL,
    [Descripcion] VARCHAR(50),
    [Defecto] BIT,
    CONSTRAINT [PK_Nacionalidades] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[NIVEL_ACADEMICO] (
    [CODIGO] INT NOT NULL,
    [DESCRIPCION] NVARCHAR(50) NOT NULL,
    [ID_Nivel_Educacion_Mt] INT,
    CONSTRAINT [PK_NIVEL_ACADEMICO] PRIMARY KEY CLUSTERED ([CODIGO])
);

-- CreateTable
CREATE TABLE [dbo].[Paises] (
    [Codigo] INT NOT NULL,
    [Descripcion] VARCHAR(50) NOT NULL,
    [Defecto] BIT,
    CONSTRAINT [PK_Paises] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Posiciones] (
    [Codigo] INT NOT NULL,
    [descripcion] VARCHAR(150),
    [Referencia] VARCHAR(150),
    [PermitirIngresoExtra] TINYINT,
    [Ano] INT,
    [MontoEncuesta] FLOAT(53),
    [Formula_SalarioHora] VARCHAR(30),
    [Codigo_Alternativo] VARCHAR(10),
    [Ruta_Documento] VARCHAR(200),
    [UrlVideo] VARCHAR(200),
    [Estatus] BIT,
    [Intermitente] BIT,
    [Formula_Salario_Diario] VARCHAR(30),
    CONSTRAINT [PK_Posiciones] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[PROVINCIAS] (
    [CODIGO] INT NOT NULL,
    [ZONA] INT NOT NULL,
    [DESCRIPCION] NVARCHAR(120),
    CONSTRAINT [PK_PROVINCIAS_1] PRIMARY KEY CLUSTERED ([CODIGO])
);

-- CreateTable
CREATE TABLE [dbo].[Solicitud_Empleo_Web] (
    [Numero] INT NOT NULL IDENTITY(1,1),
    [Fecha_Solicitud] DATETIME,
    [Cedula] NVARCHAR(13),
    [Nombre] NVARCHAR(30),
    [Apellido_Paterno] NVARCHAR(30),
    [Apellido_Materno] NVARCHAR(30),
    [Fecha_Nacimiento] DATETIME,
    [Lugar_Nacimiento] NVARCHAR(50),
    [Sexo] CHAR(1),
    [Estado_Civil] CHAR(1),
    [Nacionalidad] VARCHAR(5),
    [Direccion] VARCHAR(250),
    [Sector] VARCHAR(5),
    [Provincia] VARCHAR(5),
    [Municipio] VARCHAR(5),
    [E_Mail] VARCHAR(100),
    [Telefono1] VARCHAR(20),
    [Telefono2] VARCHAR(20),
    [TieneDependiente] VARCHAR(2),
    [Zona] VARCHAR(5),
    [Comentario] VARCHAR(250),
    [Empleado_Nuestro] CHAR(1),
    [Empleado_anteriormente] CHAR(1),
    [Disponible_trabajar] CHAR(1),
    [Empleado_Actualmente] CHAR(1),
    [FamiliarAmigo_Empresa] CHAR(1),
    [Nombre_FamiliarAmigo] VARCHAR(80),
    [Posicion_aspira] VARCHAR(5),
    [Salario_aspira] DECIMAL(18,0),
    [Fecha_Disponible] DATETIME,
    [Emergencias_Nombre] VARCHAR(50),
    [Emergencias_Telefono] VARCHAR(20),
    [Emergencias_Direccion] NVARCHAR(250),
    [Emergencias_Reaccion_Alergica] VARCHAR(100),
    [Emergencias_Nombre_Medico] VARCHAR(80),
    [Emergencias_Telefono_Medico] VARCHAR(20),
    [Emergencias_Tipo_Sangre] VARCHAR(5),
    [Nombre1] VARCHAR(80),
    [Cia1] VARCHAR(80),
    [R_Telefono1] VARCHAR(20),
    [Ocupacion1] VARCHAR(50),
    [Nombre2] VARCHAR(80),
    [Cia2] VARCHAR(80),
    [R_Telefono2] VARCHAR(20),
    [Ocupacion2] VARCHAR(50),
    [Nombre3] VARCHAR(80),
    [Cia3] VARCHAR(80),
    [R_Telefono3] VARCHAR(20),
    [Ocupacion3] VARCHAR(50),
    [Pais] INT,
    [Telefono3] VARCHAR(20),
    [Empresa_Ref1] VARCHAR(80),
    [Tel_Ref_Oficina1] VARCHAR(20),
    [Fecha_Inicio_Trabajo1] DATETIME,
    [Fecha_Termino_Trabajo1] DATETIME,
    [Salario_Inicial1] FLOAT(53),
    [Salario_Final1] FLOAT(53),
    [Funciones_a_su_Cargo1] VARCHAR(200),
    [Puesto_Ref1] VARCHAR(50),
    [Razon_Salida1] VARCHAR(100),
    [Supervisor_Ref1] VARCHAR(80),
    [Area_Experiencia1] INT,
    [Competencias_Tecnicas1] INT,
    [Empresa_Ref2] VARCHAR(80),
    [Tel_Ref_Oficina2] VARCHAR(20),
    [Fecha_Inicio_Trabajo2] DATETIME,
    [Fecha_Termino_Trabajo2] DATETIME,
    [Salario_Inicial2] FLOAT(53),
    [Salario_Final2] FLOAT(53),
    [Funciones_a_su_Cargo2] VARCHAR(200),
    [Puesto_Ref2] VARCHAR(50),
    [Razon_Salida2] VARCHAR(100),
    [Supervisor_Ref2] VARCHAR(80),
    [Area_Experiencia2] INT,
    [Competencias_Tecnicas2] INT,
    [Empresa_Ref3] VARCHAR(80),
    [Tel_Ref_Oficina3] VARCHAR(20),
    [Fecha_Inicio_Trabajo3] DATETIME,
    [Fecha_Termino_Trabajo3] DATETIME,
    [Salario_Inicial3] FLOAT(53),
    [Salario_Final3] FLOAT(53),
    [Funciones_a_su_Cargo3] VARCHAR(200),
    [Puesto_Ref3] VARCHAR(50),
    [Razon_Salida3] VARCHAR(100),
    [Supervisor_Ref3] VARCHAR(80),
    [Area_Experiencia3] INT,
    [Competencias_Tecnicas3] INT,
    [GradoAcademico] INT,
    [FechaInicio] DATETIME,
    [FechaTermino] DATETIME,
    [CentroDocente] INT,
    [CiudadCentroDocente] INT,
    [Carrera] INT,
    [TipoContratacion] INT,
    [AreaLaboral] INT,
    [PreferenciaGeografica] INT,
    [DispuestoCambioResidencia] INT,
    [ComoTeEnteraste] INT,
    [Transferido] INT CONSTRAINT [DF_Solicitud_Empleo_Web_Transferido] DEFAULT 0,
    [Horario_Disponible] INT,
    [Dispuesto_Trabajar_Horas_Extras] SMALLINT,
    [Tipo_Licencia] INT,
    [Pasaporte] NVARCHAR(25),
    [Posiciones_Puede_Aplicar] VARCHAR(200),
    [Vacante_1] INT,
    [Vacante_2] INT,
    [Vacante_3] INT,
    [Posee_Vehiculo] CHAR(1),
    [Maneja_Motor] CHAR(1),
    [Medio_Transporte] INT,
    [Posicion_aspira2] VARCHAR(5),
    [Posicion_aspira3] VARCHAR(5),
    [Zona_Descripcion] NVARCHAR(50),
    CONSTRAINT [PK_Solicitud_Empleo_Web] PRIMARY KEY CLUSTERED ([Numero])
);

-- CreateTable
CREATE TABLE [dbo].[Solicitud_Empleo_Web_Experiencia_Laboral] (
    [Experiencia_Laboral_Id] INT NOT NULL IDENTITY(1,1),
    [Codigo_Solicitud] INT NOT NULL,
    [Nombre_Empresa] NVARCHAR(60),
    [Telefono] NVARCHAR(20),
    [Fecha_Inicio] DATE,
    [Fecha_Salida] DATE,
    [Salario_Inicial] FLOAT(53),
    [Salario_Final] FLOAT(53),
    [Funciones_A_Cargo] NVARCHAR(max),
    [Ultimo_Puesto] NVARCHAR(60),
    [Motivo_Salida] NVARCHAR(100),
    [Supervisor] NVARCHAR(80),
    [Area_Experiencia] INT,
    CONSTRAINT [PK__Solicitu__7A51B663535206D0] PRIMARY KEY CLUSTERED ([Experiencia_Laboral_Id])
);

-- CreateTable
CREATE TABLE [dbo].[Solicitud_Empleo_Web_Formacion_Acad] (
    [Formacion_Id] INT NOT NULL IDENTITY(1,1),
    [Codigo_Solicitud] INT NOT NULL,
    [Nivel_Academico] INT NOT NULL,
    [Fecha_Inicio] DATE,
    [Fecha_Termino] DATE,
    [Centro_Docente] NVARCHAR(60),
    [Ciudad_Centro_Docente] NVARCHAR(60),
    [Carrera] NVARCHAR(60),
    CONSTRAINT [PK__Solicitu__86CA7DCD9E45B91B] PRIMARY KEY CLUSTERED ([Formacion_Id])
);

-- CreateTable
CREATE TABLE [dbo].[Solicitud_Empleo_Web_Referencias] (
    [Referencia_Id] INT NOT NULL IDENTITY(1,1),
    [Codigo_Solicitud] INT NOT NULL,
    [Nombre] NVARCHAR(80) NOT NULL,
    [Telefono] VARCHAR(20) NOT NULL,
    [Compania] NVARCHAR(30),
    [Ocupacion] NVARCHAR(30),
    [Parentesco] NVARCHAR(30),
    [E_Mail] VARCHAR(100),
    [Tipo_Referencia] INT,
    CONSTRAINT [PK__Solicitu__197CCCB277E9085A] PRIMARY KEY CLUSTERED ([Referencia_Id])
);

-- CreateTable
CREATE TABLE [dbo].[SolicitudEmpIdiomas] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [CodigoSolicitud] INT,
    [Idioma] VARCHAR(50),
    [Lee] BIT,
    [Escribe] BIT,
    [Habla] BIT,
    CONSTRAINT [PK_SolicitudEmpIdiomas] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[SolicitudWebAnexo] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Id_Anexo] BIGINT NOT NULL,
    [Id_Solicitud] INT NOT NULL,
    [Orden] TINYINT NOT NULL,
    CONSTRAINT [PK__Solicitu__5457575ABDD4ADF7] PRIMARY KEY CLUSTERED ([Id_Anexo],[Id_Solicitud],[ID])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [dta_Posiciones_01] ON [dbo].[Posiciones]([Codigo], [descripcion], [Referencia], [PermitirIngresoExtra], [Ano], [MontoEncuesta], [Formula_SalarioHora], [Codigo_Alternativo], [Ruta_Documento], [UrlVideo]);

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud_Empleo_Web_Experiencia_Laboral] ADD CONSTRAINT [FK__Solicitud__Codig__66747478] FOREIGN KEY ([Codigo_Solicitud]) REFERENCES [dbo].[Solicitud_Empleo_Web]([Numero]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud_Empleo_Web_Formacion_Acad] ADD CONSTRAINT [FK__Solicitud__Codig__639807CD] FOREIGN KEY ([Codigo_Solicitud]) REFERENCES [dbo].[Solicitud_Empleo_Web]([Numero]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Solicitud_Empleo_Web_Referencias] ADD CONSTRAINT [FK__Solicitud__Codig__60BB9B22] FOREIGN KEY ([Codigo_Solicitud]) REFERENCES [dbo].[Solicitud_Empleo_Web]([Numero]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
