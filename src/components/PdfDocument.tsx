
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, type DocumentProps } from '@react-pdf/renderer';
import { IReport, IAppointment, IPatient, IAppointmentDocument, IReportDocument } from '@/types';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        fontSize: 10,
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: 2,
        borderBottomColor: '#06695C',
        paddingBottom: 10,
        marginBottom: 20,
    },
    brandInfo: {
        flexDirection: 'column',
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#06695C',
    },
    brandDetails: {
        fontSize: 8,
        color: '#666',
        marginTop: 2,
    },
    docTitleInfo: {
        textAlign: 'right',
    },
    docType: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#06695C',
    },
    docDate: {
        fontSize: 8,
        color: '#888',
        marginTop: 2,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
        padding: 4,
        marginBottom: 8,
        color: '#06695C',
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    gridItem: {
        width: '50%',
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        width: 70,
        color: '#555',
    },
    value: {
        flex: 1,
    },
    contentBox: {
        marginTop: 10,
        lineHeight: 1.6,
        textAlign: 'justify',
    },
    table: {
        width: '100%',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 4,
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
        fontWeight: 'bold',
    },
    tableCol: {
        fontSize: 9,
        paddingHorizontal: 4,
    },
    signatureSection: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signatureBox: {
        width: 180,
        borderTop: 1,
        borderTopColor: '#ccc',
        textAlign: 'center',
        paddingTop: 5,
    },
    signatureImage: {
        width: 120,
        height: 60,
        marginBottom: 5,
        alignSelf: 'center',
    },
    qrCodeBox: {
        width: 80,
        height: 80,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 7,
        color: '#999',
    },
    hashText: {
        fontSize: 6,
        color: '#aaa',
        marginTop: 5,
        fontFamily: 'Courier',
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 25,
        width: '100%',
        marginBottom: 5,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: '#06695C',
        marginRight: 6,
    },
    checkLabel: {
        fontSize: 8,
        flex: 1,
    },
    checklistHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 4,
        color: '#06695C',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 2,
    },
    checklistGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    checklistItem: {
        width: '33.33%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    smallLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 14,
        width: '100%',
    },
});

interface PdfProps {
    data: IAppointmentDocument | IReportDocument | any;
    type: 'appointment' | 'report' | 'blank_form';
    qrCode?: string;
}

const PdfDocument = ({ data, type, qrCode }: PdfProps): React.ReactElement<DocumentProps> => {
    const isReport = type === 'report';
    const isBlankForm = type === 'blank_form';
    const report = isReport ? (data as IReport) : null;
    const patient = (data.patientId as IPatient);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.brandInfo}>
                <Text style={styles.brandName}>Dra. Stephany Rodrigues</Text>
                <Text style={styles.brandDetails}>Médica Veterinária | CRMV-RJ: 22404</Text>
                <Text style={styles.brandDetails}>Pós-graduanda em Clínica Médica e Cirúrgica de Animais Selvagens e Exóticos</Text>
            </View>
            <View style={styles.docTitleInfo}>
                <Text style={styles.docType}>
                    {isBlankForm ? 'Ficha de Exame Clínico' : (isReport ? report?.title : 'Comprovante de Atendimento')}
                </Text>
                <Text style={styles.docDate}>
                    Emitido em: {new Date().toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.docDate}>
                    Protocolo: {isReport ? report?.accessToken : (data as IAppointment).protocol}
                </Text>
                {(data as any).location && (
                    <Text style={styles.docDate}>
                        Local: {(data as any).location}
                    </Text>
                )}
            </View>
        </View>
    );

    const renderPatientInfo = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identificação do Animal e Tutor</Text>
            <View style={styles.grid}>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Animal:</Text>
                    <Text style={styles.value}>{patient?.name || '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Espécie:</Text>
                    <Text style={styles.value}>{patient?.species || '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Raça:</Text>
                    <Text style={styles.value}>{patient?.breed || 'SRD'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Sexo:</Text>
                    <Text style={styles.value}>{patient?.gender || '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Peso:</Text>
                    <Text style={styles.value}>{patient?.weight ? `${patient.weight} kg` : '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Idade:</Text>
                    <Text style={styles.value}>{patient?.age || '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Tutor:</Text>
                    <Text style={styles.value}>{patient?.tutorName || '---'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>CPF:</Text>
                    <Text style={styles.value}>{patient?.tutorCpf || '---'}</Text>
                </View>
            </View>
        </View>
    );

    const renderExameTemplate = () => (
        <View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Técnicas</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Material:</Text>
                        <Text style={styles.value}>{report?.examDetails?.material || '---'}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Método:</Text>
                        <Text style={styles.value}>{report?.examDetails?.method || '---'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resultados</Text>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCol, { flex: 2 }]}>Parâmetro</Text>
                    <Text style={[styles.tableCol, { flex: 1 }]}>Valor</Text>
                    <Text style={[styles.tableCol, { flex: 1 }]}>Unidade</Text>
                    <Text style={[styles.tableCol, { flex: 2 }]}>Referência</Text>
                </View>
                {report?.examDetails?.results?.map((res: { parameter: string; value: string; unit: string; reference: string }, i: number) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={[styles.tableCol, { flex: 2 }]}>{res.parameter}</Text>
                        <Text style={[styles.tableCol, { flex: 1, fontWeight: 'bold' }]}>{res.value}</Text>
                        <Text style={[styles.tableCol, { flex: 1 }]}>{res.unit || '---'}</Text>
                        <Text style={[styles.tableCol, { flex: 2 }]}>{res.reference}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interpretação / Observações</Text>
                <Text style={styles.contentBox}>{report?.content}</Text>
            </View>
        </View>
    );

    const renderReceitaTemplate = () => (
        <View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prescrição</Text>
                {report?.prescription?.map((p, i) => (
                    <View key={i} style={{ marginBottom: 10, borderBottom: 1, borderBottomColor: '#eee', paddingBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
                            {i + 1}. {p.medication} {p.concentration ? `(${p.concentration})` : ''}
                        </Text>
                        {p.activePrinciple && (
                            <Text style={{ fontSize: 8, color: '#666', fontStyle: 'italic' }}>
                                Princípio Ativo: {p.activePrinciple}
                            </Text>
                        )}
                        <View style={{ marginTop: 4, marginLeft: 10 }}>
                            <Text>Posologia: {p.dosage} - {p.frequency}</Text>
                            <Text>Duração: {p.duration} | Via: {p.route || 'Oral'}</Text>
                            {p.notes && <Text style={{ color: '#555', marginTop: 2 }}>Obs: {p.notes}</Text>}
                        </View>
                    </View>
                ))}
            </View>

            {report?.observations && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Orientações Gerais</Text>
                    <Text style={styles.contentBox}>{report.observations}</Text>
                </View>
            )}
        </View>
    );

    const renderAtestadoTemplate = () => (
        <View style={{ marginTop: 20 }}>
            <Text style={[styles.contentBox, { fontSize: 12, lineHeight: 1.8 }]}>
                {report?.atestadoDetails?.declaration || report?.content}
            </Text>

            {report?.atestadoDetails?.startDate && (
                <View style={{ marginTop: 20 }}>
                    <Text>Válido de: {new Date(report.atestadoDetails.startDate).toLocaleDateString('pt-BR')}
                        {report.atestadoDetails.endDate ? ` até ${new Date(report.atestadoDetails.endDate).toLocaleDateString('pt-BR')}` : ''}
                    </Text>
                </View>
            )}
        </View>
    );

    const renderLaudoTemplate = () => (
        <View>
            {report?.anamnese && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Histórico Clínico (Anamnese)</Text>
                    <Text style={styles.contentBox}>{report.anamnese}</Text>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Exame Clínico</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}><Text style={styles.label}>Temp:</Text><Text style={styles.value}>{report?.physicalExam?.temp || '---'}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.label}>FC:</Text><Text style={styles.value}>{report?.physicalExam?.fc || '---'}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.label}>FR:</Text><Text style={styles.value}>{report?.physicalExam?.fr || '---'}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.label}>TPC:</Text><Text style={styles.value}>{report?.physicalExam?.tpc || '---'}</Text></View>
                </View>

                <View style={{ marginTop: 8 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Avaliação por Sistemas:</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {report?.physicalExam?.systems?.cardiovascular && <Text>• Cardiovascular: {report.physicalExam.systems.cardiovascular}</Text>}
                        {report?.physicalExam?.systems?.respiratorio && <Text>• Respiratório: {report.physicalExam.systems.respiratorio}</Text>}
                        {report?.physicalExam?.systems?.digestorio && <Text>• Digestório: {report.physicalExam.systems.digestorio}</Text>}
                        {report?.physicalExam?.systems?.neurologico && <Text>• Neurológico: {report.physicalExam.systems.neurologico}</Text>}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Conclusão / Diagnóstico</Text>
                <Text style={styles.contentBox}>{report?.content}</Text>
                {report?.diagnosis && (
                    <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Diagnóstico: {report.diagnosis}</Text>
                )}
            </View>
        </View>
    );

    const renderBlankFormTemplate = () => {
        const checklist = [
            {
                title: 'Cardiovascular',
                items: ['Sopros cardíacos', 'Arritmia', 'Taqui/Bradicardia', 'Mucosas alteradas', 'Perfusão inadequada / TPC ↑']
            },
            {
                title: 'Respiratório',
                items: ['Dispneia', 'Taquipneia / Bradipneia', 'Sons anormais', 'Secreção nasal', 'Tosse / Espirros', 'Cianose']
            },
            {
                title: 'Digestório',
                items: ['Anorexia / Hiporexia', 'Vômito / Regurg.', 'Diarreia / Constip.', 'Dor abdominal', 'Distensão abd.', 'Fezes alteradas']
            },
            {
                title: 'Neurológico',
                items: ['Alteração consciência', 'Ataxia', 'Convulsões', 'Tremores', 'Déficits motores', 'Resposta alterada']
            },
            {
                title: 'Tegumentar',
                items: ['Lesões cutâneas', 'Alopecia', 'Prurido', 'Feridas', 'Parasitas', 'Alt. coloração']
            },
            {
                title: 'Locomotor',
                items: ['Claudicação', 'Dor manipulação', 'Mobilidade ↓', 'Edema articular', 'Fraturas / Deform.']
            },
            {
                title: 'Geral / Linfonodos',
                items: ['Linfonodos ↑', 'Febre / Hipotermia', 'Desidratação', 'Perda de peso', 'Apatia / Letargia']
            },
            {
                title: 'Outros',
                items: ['Verificar cavidade oral', 'Conduto auditivo', 'Ocular', 'Comportamental']
            }
        ];

        return (
            <View>
                <View style={[styles.section, { marginBottom: 6 }]}>
                    <Text style={styles.sectionTitle}>Anamnese / Histórico</Text>
                    {[1, 2, 3, 4, 5, 6].map(i => <View key={i} style={styles.smallLine} />)}
                </View>

                <View style={[styles.section, { marginBottom: 6 }]}>
                    <Text style={styles.sectionTitle}>Exame Clínico de Base</Text>
                    <View style={[styles.grid, { marginBottom: 5 }]}>
                        <View style={styles.gridItem}><Text style={styles.label}>Temp:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                        <View style={styles.gridItem}><Text style={styles.label}>FC:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                        <View style={styles.gridItem}><Text style={styles.label}>FR:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                        <View style={styles.gridItem}><Text style={styles.label}>TPC:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                        <View style={styles.gridItem}><Text style={styles.label}>Mucosas:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                        <View style={styles.gridItem}><Text style={styles.label}>Peso:</Text><View style={[styles.smallLine, { width: 50 }]} /></View>
                    </View>

                    <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 2 }}>Marcador de Sistemas (Triagem):</Text>
                    <View style={{ fontSize: 6, color: '#666', marginBottom: 5 }}>
                        <Text>Cardiovascular: _________________ Respiratório: _________________ Digestório: _________________ Neurológico: _________________</Text>
                        <Text style={{ marginTop: 2 }}>Tegumentar: _________________ Locomotor: _________________ Geral/Linfonodos: _________________ Outros: ____________</Text>
                    </View>
                </View>

                <View style={[styles.section, { marginBottom: 10 }]}>
                    <Text style={[styles.sectionTitle, { marginBottom: 3, fontSize: 9 }]}>✅ CHECKLIST CLÍNICO – AVALIAÇÃO DE ALTERAÇÕES</Text>

                    {checklist.map((sys, idx) => (
                        <View key={idx} style={{ marginBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', paddingBottom: 4 }}>
                            <Text style={[styles.checklistHeader, { fontSize: 8, marginTop: 4, marginBottom: 2 }]}>{sys.title}</Text>
                            <View style={{ flexDirection: 'row', gap: 15, marginBottom: 3 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.checkbox, { width: 10, height: 10 }]} /><Text style={[styles.checkLabel, { fontSize: 7 }]}>Sem alterações</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={[styles.checkbox, { width: 10, height: 10 }]} />
                                    <Text style={[styles.checkLabel, { fontSize: 7 }]}>Com alterações → __________________________________________________________________</Text>
                                </View>
                            </View>
                            <View style={styles.checklistGrid}>
                                {sys.items.map((item, i) => (
                                    <View key={i} style={[styles.checklistItem, { width: '25%' }]}>
                                        <View style={[styles.checkbox, { width: 7, height: 7, marginRight: 3 }]} />
                                        <Text style={{ fontSize: 6.5, color: '#555' }}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Suspeitas / Conduta / Prescrição</Text>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <View key={i} style={styles.smallLine} />)}
                </View>
            </View>
        );
    };

    const isDualPage = isReport && (report?.type === 'receita' || report?.type === 'atestado');

    return (
        <Document>
            {/* Page 1 / 1st Copy */}
            <Page size="A4" style={styles.page}>
                {report?.status === 'draft' && (
                    <Text style={{
                        position: 'absolute',
                        top: '40%',
                        left: '10%',
                        fontSize: 80,
                        color: 'rgba(200, 200, 200, 0.3)',
                        transform: 'rotate(-45deg)',
                        zIndex: -1,
                        width: '150%',
                        textAlign: 'center',
                    }}>
                        RASCUNHO
                    </Text>
                )}
                {isDualPage && <Text style={{ position: 'absolute', top: 20, right: 40, fontSize: 8, color: '#aaa' }}>1ª VIA (Médica/Paciente)</Text>}
                {renderHeader()}
                {renderPatientInfo()}

                {isReport ? (
                    <>
                        {report?.type === 'exame' && renderExameTemplate()}
                        {report?.type === 'receita' && renderReceitaTemplate()}
                        {report?.type === 'atestado' && renderAtestadoTemplate()}
                        {report?.type === 'laudo' && renderLaudoTemplate()}
                        {report?.type === 'encaminhamento' && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Encaminhamento</Text>
                                <Text style={styles.contentBox}>{report?.content}</Text>
                            </View>
                        )}
                    </>
                ) : (
                    isBlankForm ? renderBlankFormTemplate() : (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resumo do Atendimento</Text>
                            <Text>Protocolo: {(data as IAppointment).protocol}</Text>
                            <Text>Data: {new Date((data as IAppointment).scheduledDate).toLocaleString('pt-BR')}</Text>
                            {(data as IAppointment).location && <Text>Local: {(data as IAppointment).location}</Text>}
                            <Text style={{ marginTop: 10 }}>Serviços:</Text>
                            {(data as IAppointment).services?.map((s: any, i: number) => (
                                <Text key={i}>• {s.name} - R$ {s.price?.toFixed(2)}</Text>
                            ))}
                            {(data as IAppointment).additionalServices?.map((s: any, i: number) => (
                                <Text key={`add-${i}`}>• {s}</Text>
                            ))}
                        </View>
                    )
                )}

                {/* Signature and Verification */}
                <View style={styles.signatureSection}>
                    {qrCode && (
                        <View style={{ alignItems: 'center' }}>
                            <Image src={qrCode} style={styles.qrCodeBox} />
                            <Text style={{ fontSize: 6, color: '#888', marginTop: 2 }}>Verificar Autenticidade</Text>
                        </View>
                    )}

                    <View style={styles.signatureBox}>
                        {report?.signatureImage ? (
                            <Image src={report.signatureImage} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 60 }} />
                        )}
                        <Text style={{ fontWeight: 'bold' }}>Dra. Stephany Rodrigues</Text>
                        <Text style={{ fontSize: 8 }}>Médica Veterinária | CRMV-RJ 22404</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        ESTE DOCUMENTO POSSUI ASSINATURA DIGITAL E HASH DE VERIFICAÇÃO.
                    </Text>
                    <Text style={styles.footerText}>
                        Stephany Rodrigues Medicina Veterinária - CRMV-RJ 22404
                    </Text>
                    {((report?.reportHash) || (data as IAppointment).hash) && (
                        <Text style={styles.hashText}>Hash SHA-256: {report?.reportHash || (data as IAppointment).hash}</Text>
                    )}
                </View>
            </Page>

            {/* Page 2 / 2nd Copy - Only for Recipes/Atestatdos */}
            {isDualPage && (
                <Page size="A4" style={styles.page}>
                    <Text style={{ position: 'absolute', top: 20, right: 40, fontSize: 8, color: '#aaa' }}>2ª VIA (Arquivo Clínico)</Text>
                    {renderHeader()}
                    {renderPatientInfo()}
                    {report?.type === 'receita' && renderReceitaTemplate()}
                    {report?.type === 'atestado' && renderAtestadoTemplate()}

                    <View style={styles.signatureSection}>
                        {qrCode && (
                            <View style={{ alignItems: 'center' }}>
                                <Image src={qrCode} style={styles.qrCodeBox} />
                                <Text style={{ fontSize: 6, color: '#888', marginTop: 2 }}>Verificar Autenticidade</Text>
                            </View>
                        )}
                        <View style={styles.signatureBox}>
                            {report?.signatureImage ? (
                                <Image src={report.signatureImage} style={styles.signatureImage} />
                            ) : (
                                <View style={{ height: 60 }} />
                            )}
                            <Text style={{ fontWeight: 'bold' }}>Dra. Stephany Rodrigues</Text>
                            <Text style={{ fontSize: 8 }}>Médica Veterinária | CRMV-RJ 22404</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>CONTROLE INTERNO - ARQUIVO DA CLÍNICA</Text>
                        <Text style={styles.hashText}>Hash SHA-256: {report?.reportHash}</Text>
                    </View>
                </Page>
            )}
        </Document>
    );
};

export default PdfDocument;
