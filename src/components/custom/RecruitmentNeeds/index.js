import React from 'react';
import MainTableSubTables from 'Common/data/MainTableSubTables/';
import { Button } from 'antd';
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  Header,
  Media,
  VerticalAlign,
  PageNumberFormat,
  PageNumber,
  Footer,
  BorderStyle,
  UnderlineType,
  FrameAnchorType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  HeightRule
} from 'docx';
import { saveAs } from 'file-saver';
const IIVILogo = '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'

export default class RecruitmentNeeds extends React.Component {
  export = record => {
    function getEmptyParagraph(height) {
      return new Paragraph({
        text: '',
        spacing: { after: 0, before: 0, line: height * 1440 }
      });
    }
    function inchToDxa(inch) {
      return inch * 1440;
    }
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri'
            }
          }
        }
      }
    });
    const logo26 = Media.addImage(
      doc,
      Uint8Array.from(atob(IIVILogo), c => c.charCodeAt(0)),
      94,
      40
    );
    const margins = { left: 60, bottom: 40, right: 60 };
    doc.addSection({
      headers: {
        default: new Header({
          children: [
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: inchToDxa(0.8), type: WidthType.DXA },
                      children: [new Paragraph({ children: [logo26] })],
                      borders: {
                        top: { style: BorderStyle.NIL },
                        left: { style: BorderStyle.NIL },
                        right: { style: BorderStyle.NIL },
                        bottom: { style: BorderStyle.NIL }
                      }
                    }),
                    new TableCell({
                      width: { size: inchToDxa(6.63), type: WidthType.DXA },
                      verticalAlign: VerticalAlign.CENTER,
                      borders: {
                        top: { style: BorderStyle.NIL },
                        left: { style: BorderStyle.NIL },
                        right: { style: BorderStyle.NIL },
                        bottom: { style: BorderStyle.NIL }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text:
                                'Job Requisition & Defining and Aligning the Recruiting Strategy (DARS)',
                              size: 26
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Table({
              rows: [
                new TableRow({
                  height: {
                    height: inchToDxa(0.14),
                    rule: HeightRule.ATLEAST
                  },
                  children: [
                    new TableCell({
                      width: { size: inchToDxa(2.06), type: WidthType.DXA },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Form Number:  XXX-XXXX',
                              size: 16,
                              font: 'Arial'
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL },
                        left: { style: BorderStyle.NIL },
                        right: { style: BorderStyle.NIL },
                        bottom: { style: BorderStyle.NIL }
                      }
                    }),
                    new TableCell({
                      width: { size: inchToDxa(4.06), type: WidthType.DXA },
                      verticalAlign: VerticalAlign.CENTER,
                      borders: {
                        top: { style: BorderStyle.NIL },
                        left: { style: BorderStyle.NIL },
                        right: { style: BorderStyle.NIL },
                        bottom: { style: BorderStyle.NIL }
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Revision:  X',
                              size: 16,
                              font: 'Arial'
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      },
      properties: {
        pageNumberStart: 1,
        pageNumberFormatType: PageNumberFormat.DECIMAL
      },
      children: [
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          borders: {
            top: {
              size: 15,
              style: BorderStyle.SINGLE
            },
            bottom: {
              size: 15,
              style: BorderStyle.SINGLE
            },
            left: {
              size: 15,
              style: BorderStyle.SINGLE
            },
            right: {
              size: 15,
              style: BorderStyle.SINGLE
            }
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    bottom: {
                      size: 15,
                      style: BorderStyle.SINGLE
                    }
                  },
                  margins: { bottom: 120 },
                  children: [
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 224.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: 'NOTE: ',
                                      bold: true
                                    }),
                                    new TextRun({
                                      text: 'A current ',
                                      bold: false
                                    }),
                                    new TextRun({
                                      text: 'Job Description ',
                                      bold: true
                                    }),
                                    new TextRun({
                                      text:
                                        'must be attached to this form (page 2). ',
                                      bold: false
                                    })
                                  ]
                                })
                              ],
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              margins: { left: 60, bottom: 20, top: 20 },
                              width: { size: 9070, type: WidthType.DXA }
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 446.4, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1814.4, type: WidthType.DXA },
                              children: [new Paragraph('Date Requested:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1526.4, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  record.DateRequested
                                    ? record.DateRequested.substring(0, 10)
                                    : ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1612.8, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date Needed:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1526.4, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.DateNeeded || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Supervisor:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3038.4, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.Supervisor || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.62),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('Segment:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3024, type: WidthType.DXA },
                              children: [new Paragraph(record.Segment || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1526.4, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Business Unit:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2347.2, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.BusinessUnit || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.6),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: 'Location:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1468.8, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_518381757151 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1094.4, type: WidthType.DXA },
                              children: [new Paragraph('Job Title:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 4320, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_662164207639 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 907.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Dept:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2116.8, type: WidthType.DXA },
                              children: [new Paragraph(record.Dept || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 907.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Shift:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1468.8, type: WidthType.DXA },
                              children: [new Paragraph(record.Shift || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    ,
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.63),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('Reason for Opening:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 4708.8, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.ReasonforOpening || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2347.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Replacement for:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1499.2, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_518382420474 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    ,
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1712, type: WidthType.DXA },
                              children: [new Paragraph('Employee Type:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2507.2, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.EmployeeType || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1080, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Status:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2160, type: WidthType.DXA },
                              children: [new Paragraph(record.Status || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1382.4, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Pay Type:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1972.8, type: WidthType.DXA },
                              children: [new Paragraph(record.PayType || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    ,
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1195.2, type: WidthType.DXA },
                              children: [new Paragraph('Budgeted?')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2160, type: WidthType.DXA },
                              children: [new Paragraph(record.Budgeted || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1800, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Budget Quarter:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2678.4, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.BudgetQuarter || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1627.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Budgeted Rate:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1368, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.BudgetedRate || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    ,
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1598.4, type: WidthType.DXA },
                              children: [new Paragraph('Job Grade Level:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_662164217858 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1627.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Salary Range:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1627.2, type: WidthType.DXA },
                              children: [
                                new Paragraph(`${record.Min}--${record.Max}`)
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.08),
                    ,
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 331.2, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2140, type: WidthType.DXA },
                              children: [new Paragraph('Relocation Eligible?')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 2798.4, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.RelocationEligible || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2347.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Incentive Eligible?',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3628.8, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.IncentiveEligible || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 273.6, type: WidthType.DXA },
                              children: [new Paragraph('')]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    bottom: {
                      size: 15,
                      style: BorderStyle.SINGLE
                    }
                  },
                  margins: { bottom: 120 },
                  children: [
                    new Table({
                      rows: [
                        new TableRow({
                          height: { height: 224.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: 'SIGNATURES FOR HIRE: ',
                                      bold: true
                                    })
                                  ]
                                })
                              ],
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              margins: { left: 60, bottom: 20, top: 20 },
                              width: { size: 9070, type: WidthType.DXA },
                              columnSpan: 6
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_648055181038 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  record.C3_648055207056
                                    ? record.C3_648055207056.substring(0, 10)
                                    : ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({ text: 'Department Manager' })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_648055181827 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  record.C3_648055207345
                                    ? record.C3_648055207345.substring(0, 10)
                                    : ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: 'Senior Manager '
                                    }),
                                    new TextRun({
                                      text: '(1-Up)',
                                      italics: true
                                    })
                                  ]
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_648055182113 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  record.C3_648055207614
                                    ? record.C3_648055207614.substring(1, 10)
                                    : ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [new Paragraph({ text: 'Local HR' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [
                                new Paragraph(record.C3_648055182431 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  record.C3_648055207875
                                    ? record.C3_648055207875.substring(0, 10)
                                    : ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({ text: 'General Manager' })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: 'Group VP '
                                    }),
                                    new TextRun({
                                      text: '(If applicable)',
                                      italics: true
                                    })
                                  ]
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [
                                new Paragraph({ text: 'Segment President' })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [new Paragraph({ text: 'President' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        }),
                        new TableRow({
                          height: { height: 244.8, rule: HeightRule.ATLEAST },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 345.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 1353.6, type: WidthType.DXA },
                              children: [new Paragraph('Approved by:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 3600, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 720, type: WidthType.DXA },
                              children: [
                                new Paragraph({
                                  text: 'Date:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: { size: 1281.6, type: WidthType.DXA },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 2419.2, type: WidthType.DXA },
                              children: [new Paragraph({ text: 'CEO' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    bottom: {
                      size: 15,
                      style: BorderStyle.SINGLE
                    }
                  },
                  margins: { bottom: 120, top: 120 },
                  children: [
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.24),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.88),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph('Minimum Education Required:')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.17),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(
                                  record.MinimumEducationRequired || ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.14),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.24),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.65),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph('Certifications Required:')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(4),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(
                                  record.CertificationsRequired || ''
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.96),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '% of Travel:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.9),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph(record.Travel || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0.14),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.17),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 9070, type: WidthType.DXA },
                              children: [
                                new Paragraph(
                                  'What are keywords that can be used in the resume search?'
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('1)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.48),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950006742 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.37),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '4)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950015958 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('2)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.48),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950013403 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.37),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '5)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950017097 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('3)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.48),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950014749 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.37),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '6)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950038041 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.34),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.7),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(
                                  'Top 3 Critical Technical/Functional Skills (Knowledge/Skills):'
                                )
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph('Top 3 Behaviors (Competencies):')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('1)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.5),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950067765 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.54),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '1)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950072943 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('2)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.5),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950070736 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.54),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '2)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950101017 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.3),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.29),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('3)')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.5),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950071735 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.54),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: '3)',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.18),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.C3_644950102595 || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.19),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    bottom: {
                      size: 15,
                      style: BorderStyle.SINGLE
                    }
                  },
                  margins: { bottom: 120 },
                  children: [
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.24),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: { size: 9070, type: WidthType.DXA },
                              children: [new Paragraph('FILLED BY:')],
                              verticalAlign: VerticalAlign.CENTER,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.23),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.56),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('Name:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.77),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph(record.Name || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.45),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: 'Date of Hire:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.17),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.DateofHire || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.76),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    }),
                    getEmptyParagraph(0),
                    new Table({
                      rows: [
                        new TableRow({
                          height: {
                            height: inchToDxa(0.26),
                            rule: HeightRule.ATLEAST
                          },
                          children: [
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.93),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph('Rate of Pay:')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.72),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph(record.RateofPay || '')],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(3.12),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph({
                                  text: 'Badge Number:',
                                  alignment: AlignmentType.RIGHT
                                })
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(1.1),
                                type: WidthType.DXA
                              },
                              children: [
                                new Paragraph(record.BadgeNumber || '')
                              ],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            }),
                            new TableCell({
                              borders: {
                                top: { style: BorderStyle.NIL },
                                left: { style: BorderStyle.NIL },
                                right: { style: BorderStyle.NIL },
                                bottom: { style: BorderStyle.NIL }
                              },
                              width: {
                                size: inchToDxa(0.76),
                                type: WidthType.DXA
                              },
                              children: [new Paragraph({ text: '' })],
                              verticalAlign: VerticalAlign.BOTTOM,
                              margins: margins
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 200, before: 1000 },
          children: [
            new TextRun({
              size: 22,
              text: 'KEY JOB DUTIES & RESPONSIBILITIES: ',
              bold: true
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              size: 22,
              text:
                '(If Contractor/Temporary, please indicate length of project with a maximum 90 days)',
              italics: true
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: record.C3_644950274193 || '', size: 22 })
          ]
        }),
        new Paragraph({
          spacing: { after: 200, before: 1000 },
          children: [
            new TextRun({
              text: 'SKILLS & QUALIFICATIONS: ',
              size: 22,
              bold: true
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: '(Include Education, Skills & Experience) ',
              size: 22,
              italics: true
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: record.C3_644950276935 || '',
              size: 22,
              italics: true
            })
          ]
        })
      ]
    });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'Coherent New Hire Req.Form.docx');
    });
  };
  render() {
    return (
      <MainTableSubTables
        {...this.props}
        mainTableProps={{
          actionBarWidth: 200,
          hasAdd: true,
          hasBeBtns: true,
          hasModify: true,
          hasBackBtn: true,
          hasDelete: true,
          hasRowModify: true,
          hasRowView: true,
          hasRowDelete: true,
          recordFormUseAbsolute: true,
          customRowBtns: [
            (record, btnSize) => {
              return (
                <Button
                  size={btnSize}
                  onClick={() => {
                    this.export(record);
                  }}
                >
                  导出
                </Button>
              );
            }
          ],
          formProps: {
            width: 1250
            // height: 500
          },
          advSearch: {
            isRequestFormData: false
          },
          subtractH: 200
        }}
      />
    );
  }
}
