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
const IIVILogo = "iVBORw0KGgoAAAANSUhEUgAAAL8AAABlCAYAAAFrSALZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAIdUAACHVAQSctJ0AABPvSURBVHhe7Z0NkC1HVcc3JoBIFDF57E7P3O65+zYhLBCjzyJi1IdQAdFYMSUBNRj8ILGUeqBFlQRRnpFCCXnE7Ns7c+++fJmIVvFEA36AglVikFIxVPhQJGIEAgjGRCSBfCfPc2bP3O3pOXNnuu/cj323f1X/2p3uc07P9Jw7d2ZuT89SEsaP98P4mIuWCK4uF5nsGNGi5iS/RkWFQFQ0JAnkx7K/K+qZrI1ZmC83bSAvG6sBxLTLyctaa6Dfic+nooyD+/efhH/ba0CzTcP46/SvewN6vf4/ov8/kQZSEb+P/h2/i5CduvjYlctnPoWKM9ppIFC/tVNfDNRKA8hO/aQbWI6eS0UZpQbgn4tJFLC4nATxA7icGWskQj6M9bSYgXZpqC7LfTM/bcFKFBOOQerfufpcmdHbo+jJhQLAXL5pefkpZplOXs7aNGkAycvyw4JOKuXT8C/nZ91AqVyo++jfcRvo/jZfPtqvcQMIV94X8ZfpX7cGuP8hTb+Cyya67RCbBhKhsvwfLgfyYfybo9cNsekiRK8zbVg/1wYOS9lNA3UZFWewfq4NcPVsuW0DB5f2n1RVXyqHhYvTqPuqvAKXSYVlMh+S19MiLMuXkm3Rry/leq7NQH63ZrAtrT6TWR+q+0wbOKL+jWl3RKiz8npapyG9aO+a7p/50P+p6J5nxtJtKcQ2+q7IRVVDzPomX3i5qGokaDcQ8btosfD9VRunzQ04HKgzTFs4PUuomqWvVIx2tJgxsw1AoP4x056qWLB+ILqvpsWMmW4AYtrD1dQ3qKoAnMhdgPW0OGTmG4DnxKYPVRXA8s3O6vfQ4pCpboBZR8WMTzEuHLUuN8tyZr4HkGvk3n2mX68Tv4yqs5jp6urTabHAXGwAwt1JyMpF/Kf5/xxzswGI6Qsb9W/498KlpRPJpMRcbUAq5Adt/edqAxDTn4orqd0AOEP+uTZFYSvpR1GY2/aD4l2aHLjGeJkec5SYHp2saB0LcHZNVTgbNSvhbP8LhXrGplTP2Wh2tM4Fyr7q7uLyjuCL8ZW6PYXYxjSGXXkHVQ0xbai4AJRbnQPpoO0NSn07LZbaS6J4P1WVMY1dNwC+WX/dtAO9lqorgYNIiLa0mGHEmM4GIKadefnMkYTq/WbMUpxZbcAo2xy0SUP5blrMMGNMbQN6In5vU9sczsaMMbUNOKjUN5u2cEXGXgsgR0T3dC6eGWNqG4CYtqPs4fD4ZficPESLQ0z/qW5AxRnoCdu1RbJ6oX6WFoeY/lPdgCOdvc8y7eFL6g1UXaAqluk/1Q1ATHvOB743XsKVI6bvxDYA/v+UXo7HdCyvupDRyewrvidM3+lvgFBv1MtRm0I9L3MiMnshOrRYwPSd+gYgejkKThK/RFVLR+FqDMtosYTpO/XPAGL66H6pUFfoyyam30w2AE4P/rrKb3tZfYAWS5h+M9mAg+vrTzT94MjzIayri2H6zWQDENMPVZf/iOkzVxsA37wfwb9kwmL6zGwDIGW+1/TNJNQvkwmLaT+zDUBM3yb+pr3fANOGihthXiv3gvh/qaoS3R5V2gAozH811H8B3JaQ/03l1TaFutXTKGwlmt+xRJ32TCousBMvk94W3lb5HSrP1OqdObyqonWoRLenohK6TZ3GGkC3W0T9MpK6sTGTEjVfhrtRXRLzGTdh/QpqdnM7jdRP8/5F9QLVI5dWSIL4RXnsQRAfoOIh3M1zUyMPnFXM2w5AIEu/yMcoisxbAc6Tv5bHPbi09E1UPGShdgDCxyjpw2Q+FpD9B4Yxxc5PqjoLtwPgO+sQH6coPPMlFyfy6xQU7Ij/ouISC7cDtvbtewLePuJjaQri+8nFCTjevyaPNWCGb+Qs3A5A4FNQOj/llEInkos1eYxEyP+jIpaF3AFIGsZ38/GKInMreivqPbn/dStre6iYZWF3AI4O5+MZCuK/IJdG9PbsOXl4bRSoWt+F3QFIKtRhPqYhcyTCCBIRvyP3uyaKvoOKK1noHQDn5fgpKI3GKEveRS4jORQEpw59IvXnVDyShd4BCP4ey8ctahCpHyaXSiDWJ3N7KqrluNwBUF74jc2U/psbAsv3cna6wOZRMmfBcUk79upXqbgWvwMIzs5UT3T+kMxLwBfuZ8jusVFDV038DiDgtLTP2Zq6OliV5DKkH8hz8vo0Uj9PxY1Y+O+AnOwKmZ7rHKU0VLeTyxDYef+JdUkQ30NFjfE7QKMfdhpdIes/vAw6a3vzcjit/S4qbozfAQZpIB/k29Gk3SfKy+CT8T9UZIXfAQx8O0VBh1+pn8LiJ4HcrfA7gAHipuV2ykrC+NHtv+Uv9ab4HcCQ3csX6hG+vbJgW2tvOVThd0AFvYZXyKmQf0cuTvgdMAKIX3ufiEyd8TtgNCfwbW4rDdTlZOfM2DtgzscFXUKr6Uwquuwta/wCxoG3ZFYLXKQ1GpFhqwYZuruF4wmpDytpksWTkO98YHadrz23WlAY32wam0pl9zzWNxfjUxLnZ2gg5AtZX1NB/FXTdys4/VTq40o21taeZPrlSoX6qNbGd5ZsQnWnVs/L9CFR82XSML6BDaQpUYodUZvD+Zgi01pwPA7nb4rMW6MuNqzXf+g2nMi0OfPW+XD4OMr5m0oDuY9cxkZ/RjUV8a1UXGAhOv8wfuQZf0atDEFEkkD+wjBupC6g4gIL0fkI528qCeW9ZD42cNV8yzCu2Ms+87gwnd90nP7VYVj7NEgTcOTbdszqkROLlPmNDj3w/TD2FSwc458xjBeoP6biEgvT+TTGh42jCzrrE+TiDMT5xTxer2LYObIwnY80PfT8njatjQuJUP+McfAWDBWxLFTnp0K+motTUiDPIRdr8OmWPA70Q+X0J8hCdf6G9qP4SAn5QXKxBjpff9o9pWKWhep8BE4nv8LFMkXm1iShelse451R9GQqZlm4zh/A2QcXy9RGuBaRixV6DCqqZOE6vxfGZ3OxTKWi8yfkYoP+Q0zt1fLCdT7CxSpJm2++Kf2ge27uD33wM1RcyUJ2fiLiz3LxdOFpYrrMz65bBeywd+X+qTxtlYorWcjOH0Td53DxTCWBLD2VPgr4Mv/8tl+z8Z0L2fk3MFMSckpFt/FQkZ5SKzu+6j1UPJKF7HwEDhH/wsU0hSMyyGUkcAE3fF9CGsqfoOKRLGznp6H6FS6mqSPLsksuI8Gzo9yHimpZ2M4/DJ3KxTSVRnGjU86hfRiPfOxIZ2E7H4FjM878xMbWReYj0eyvp6JajqvO1++jVwnfc0Pm2PnDp85HCW9HkwtLP+oOfzKkokYsdOfDGcpZnE1ZnUPkwtIXcjhnDxU1YqE7H+FsSqoZXwo22QBbvI9PRY3wnS/UHZydqapTznQ5enZuA9tde0tBZ+E7PxHy+zg7U1Xn7kmoNnfs6qdi1Fn4ztdfqDlKVaec/UB+PKt3eGjuuOp8V/qh/DQX35T5NPqV+o4T3b+i4sb4zgeSMH49F9/UVhAUBs5Ctu/MbByon6LixvjOB/rL229WrFMSqLeRS0YaxFfldTZzNOT4zidcrnarypviO5/oNbzaxfkcyEVbRzlylEIVvvOJJmdKKBz7g/a9KPrBvMx1kJXvfA2uDVOwbR9F2yTsZK+SROFAqSyAJb7zNfQpvioVyAePLq0/ETruAVyGbb2N3K3xna+hH0pGKenEL8//h229lNyt8Z2v8dbV1ady7ZiCU8ws61GbDV6OUIXvfIOmV7uZGrznYxS+8w0GYZd76SivMQbUIr7zDTY6nWYjmUFwevpKcnPCdz4DdMo9XHumyNwZ3/kM3ItqOZG5M77zGdKny1WuPUPXkbkzvvMr4NrTtVEzx34TfOdXkNIrE6t0EK5yydSZsTofKoevddM10J6+rlIaqsvgL+tPYv0McX4XJyJ+Oa2iM2koXwCxuDbhFFN9ksxq2QjDCHzY9aTX9fFt7Ij1bZSdM9LdtO3O4J1KJm6mVHRfR2a16ANo2xQ+b8q+G3DWcvlJjwMOPT/Jxbd5aALfNc3FGFf42+dx//7F411w+K+dTasJOOPWrN5DOQvhF/bf2gi+q27BZ824YFYK4vvxhIRro6nYuLYS6hEutosg1key2ca4dhwE5wz34jysXFu6+pG8iPJ3LLaCVQnb8AdcGyMltp+mMtUL4n9g7TVlJ6WQC5y/jeAE/TYu/ijRZjcHRz02uRKolYjvqLtaqIONa632pliF3jypH6m38u046bG00/0BCj+X9NbXT8bfB811HzR9si37tqm/YqqT0zy+tvjkH82R5c6zkkD+E9+WvfA0RB/zMm+kQffK8jrLh66SsvZhZsQnvyNsXGu1P7k27MwD+lMv4yoV8W9Q6LkiCbtnwvVGaTYYHI7Z9FFcn/yOsHGt1X7yby3tewLE/nC5LTdBcnwRpxml8HMD9N3v98PiSzzgOuX2I0KdRSa1+OR3hI1rrcm8VmEQxmfjzP18m3ZKQvVoGqkb5+n0B2/gY6Ib6/rYIFCXbwX7voXMavHJ7wgb11qTSX5En8BtXEGi3dkL5Usp9EzBi1zIgfLLLIW6tb/cfS6ZNcInvyNsXGtNLvmxr+DoXztTVlPhbCnXV0y0PU3SKH4xXIgX3y8TxPfDNcCbjy0tnUBmjfDJ7wgb11qTS/5s0tpAXWCeF7sqDeRDSShf4fqMRxukUj6NPepH6uPXrsSKzBrjk98RNq61Jpf8CP6Mjy8T59t20q1bq+X3Yk+JE/pSnpMaP0rhhxJy4jVkY4VPfkfYuNaabPIj/aBzbpOJQpsKTjvg4D998Clybq7lNFS3u16M++R3hI1rrckn/6WQGDgbVlt3f1B4+kHhp0Z/WT2fW5dBKH+UTKzxye8IG9dak09+BN/aB/2mvxFwTKlbKPTUgOuXz5jrkYr4fVTthE9+R9i41ppO8iNw5H8t9N3X+fWwE8R5fNT7jtoG+ukSbj3GedoZ8cnvCBvXWtNLfiSh90W1I/np61p4DqqOQ0Fwasoe9dXVvT3rJ5OZEz75HWHjWmvKyR92z+TXw17ZXRcRv4VCTwxo403mNxYm7KZQzyMTZ3zyO8LGtdZ0kx+B8/U38+tiLziV+tckVD9EoVtnM+o+Jw3kP5bahg8dvvCDzJzxye8IG9da00/+jbW1b2PGxbgrUL2t1dWnUvjWwMnyEzjq4wM/entJID82zhsrdXzyO8LGtdb0kx9/od2K1I9DEj3Mr5OdIHnu6YXqR2yHFtTRE+os89kEaOsB2He/SyZj45PfETautaaf/MjgVBlAH7T2yy/ectwKTi/MMT0O2/tZlWb7wm8sfKUumY2NT35H2LjWmk3yI3DB+mLsB369HNTSs7xIL4rW4ANVeFYbri8e70fxr5FJK/jkd4SNa63ZJT/OGATn0xtwQdnK6Q9OdIn7h8KPRSrUFWZ8uLD+/MH18Wc50vHJ7wgb11r1yb/ZeYZIhNqEdb7ZVYNIHhxIGVDIIf2VtXX4ANRPIt1UQt1EoZ05Eq7hDFHZ+690JZ34RWTSGj75HWHjWqs++eHrH+f3/1TZt7ngqPl+821JOYMoPgAJMJwjehzhw+M9IV9IoZ2AODebceFc/91U3So++R1h41pr9smPIyL7obqV83MRXKh+qLdnj9Mvr5tB59zy8wfqvl4Yn00mreKT3xE2rrVmn/zINVDH+bkIkumetKN+iUJbwf2g1RNqy/UNNXX45HeEjWut+Uh+hLvIdBUe/dMoejaFbgT4XQxH+buKceTncCgzmbSOT35H2LjWmp/kv1GIU9JAfYLzt1Ui5MNw8fvGpkMQroKLcUjCvzTjwL5+O+5zMmsdn/yOsHGtVZ/8162s7Ekj9To4ml7hrKj7KkxuCsmCT0rhMGV+Pe0F7d7Z9Fwd3+sPH9B7C/7wQcT3R5PJRPDJ7wgb11r1yT9N8JffRMTv4NfVXvChPYLv4KbwLH2lYvig/FnBV2Tzbx4ik4nhk98RNq615iv5kX4nPj8J+ZmPbQVJ/cioQWhHL7zwRKi/qPSIpZCfO7wsu2Q2MXzyO8LGtdb8JT8OUIM+7rf1zG8Sdj5LoUvgO+ehnb8v+Qj5JjKZKD75HWHjWmv+kh/Bi2xIyuH7mMfVIIxfT6ELwL681LRNQ3kXVU8cn/yOsHGtNZ/JjySRPJAaY+mdJeKvJiunFfo725fMyzQS0f0xMpk4PvkdYeNaa36TH09/2nrmNxuRGXYLL4yAC+u3lGxF5734EAuZTByf/I6wca01v8mPHJayaz5J5So4lfrSQGy/YnH7twt1X8EmiO9v47lcG3zyO8LGtdZ8Jz8CSdraM794SzMRe/HthjeZF9Q4jGFTnDHyt4i28cnvCBvXWvOf/Nd2OjikupXTnzSQD6ZB90bs/0KdUHfAhe4LqMmp4ZPfETauteY/+Q8u7T+pF3Uv4l781oZgfz4KSq445ZRvpSanhk9+R9i41pr/5Efw6D8I4z/it2E84XO5g+XJTX8yCp/8jrBxrbU7kh+BC9Lz4QPQ2mzPKJpBIqUmpo5PfkfYuNbaPcmPz8+mIr62/LDJGMKH1JdVTE1MHZ/8jrBxrbV7kh85HKgz2pzrv+qX32nhk98RNq61dlfyI/1AvYHfFjulgfpC2xNd2eKT3xE2rrV2X/IjcPQff9xPoC6gcDPDJ78jbFxr7dbkFx1+e5qpF6oPvBP2JYWbGT75HWHjWmt3Jj8CF7+/yW9TvXpB5/spzEyZafJvD3jiA3pV6m7QJdSFMwPv0sB63KatV1Ndv7Gy0vpLLVIhz4NELr6fd47lk99Nc5H8R5eWTkzC7itgH37DWL9K4UUuJimFaJXdlfzxsf8H/5lpj3WmVxkAAAAASUVORK5CYII="

export default class RecruitmentNeeds extends React.Component {
	export = (record) => {
		function getEmptyParagraph(height) { return new Paragraph({ text: '', spacing: { after: 0, before: 0, line: height * 1440 } }) }
		function inchToDxa(inch) { return inch * 1440 }
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
			75.6,
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
											borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } }
										}),
										new TableCell({
											width: { size: inchToDxa(6.63), type: WidthType.DXA },
											verticalAlign: VerticalAlign.CENTER,
											borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
											children: [
												new Paragraph({
													alignment: AlignmentType.RIGHT,
													children: [new TextRun({
														text: 'Job Requisition & Defining and Aligning the Recruiting Strategy (DARS)',
														size: 26
													})]
												})
											]
										}),
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
											children: [new Paragraph({
												children: [new TextRun({
													text: 'Form Number:  XXX-XXXX',
													size: 16,
													font: 'Arial'
												})]
											})],
											borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } }
										}),
										new TableCell({
											width: { size: inchToDxa(4.06), type: WidthType.DXA },
											verticalAlign: VerticalAlign.CENTER,
											borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
											children: [
												new Paragraph({
													children: [new TextRun({
														text: 'Revision:  X',
														size: 16,
														font: 'Arial'
													})]
												})
											]
										}),
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
						},
					},
					rows: [
						new TableRow({
							children: [
								new TableCell({
									borders: {
										bottom: {
											size: 15,
											style: BorderStyle.SINGLE
										},
									},
									margins: { bottom: 120 },
									children: [
										new Table({
											rows: [
												new TableRow({
													height: { height: 224.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															children: [new Paragraph({
																children: [
																	new TextRun({
																		text: "NOTE: ",
																		bold: true
																	}),
																	new TextRun({
																		text: "A current ",
																		bold: false
																	}),
																	new TextRun({
																		text: "Job Description ",
																		bold: true
																	}),
																	new TextRun({
																		text: "must be attached to this form (page 2). ",
																		bold: false
																	}),
																]
															})],
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															margins: { left: 60, bottom: 20, top: 20 },
															width: { size: 9070, type: WidthType.DXA },
														})]
												}),
											]
										}),
										getEmptyParagraph(0.08),
										new Table({
											rows: [
												new TableRow({
													height: { height: 446.4, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1814.4, type: WidthType.DXA },
															children: [new Paragraph("Date Requested:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1526.4, type: WidthType.DXA },
															children: [new Paragraph(record.DateRequested ? record.DateRequested.substring(0, 10) : "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1612.8, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date Needed:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1526.4, type: WidthType.DXA },
															children: [new Paragraph(record.DateNeeded || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph({ text: "Supervisor:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3038.4, type: WidthType.DXA },
															children: [new Paragraph(record.Supervisor || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0.08),
										new Table({
											rows: [
												new TableRow({
													height: { height: 331.2, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.62), type: WidthType.DXA },
															children: [new Paragraph("Segment:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3024, type: WidthType.DXA },
															children: [new Paragraph(record.Segment || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1526.4, type: WidthType.DXA },
															children: [new Paragraph({ text: "Business Unit:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2347.2, type: WidthType.DXA },
															children: [new Paragraph(record.BusinessUnit || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.6), type: WidthType.DXA },
															children: [new Paragraph({ text: "Location:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1468.8, type: WidthType.DXA },
															children: [new Paragraph(record.C3_518381757151 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0.08),
										new Table({
											rows: [
												new TableRow({
													height: { height: 331.2, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1094.4, type: WidthType.DXA },
															children: [new Paragraph("Job Title:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 4320, type: WidthType.DXA },
															children: [new Paragraph(record.C3_518381536343 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 907.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Dept:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2116.8, type: WidthType.DXA },
															children: [new Paragraph(record.Dept || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 907.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Shift:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1468.8, type: WidthType.DXA },
															children: [new Paragraph(record.Shift || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(1.63), type: WidthType.DXA },
															children: [new Paragraph("Reason for Opening:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 4708.8, type: WidthType.DXA },
															children: [new Paragraph(record.ReasonforOpening || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2347.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Replacement for:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1499.2, type: WidthType.DXA },
															children: [new Paragraph(record.C3_518382420474 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1712, type: WidthType.DXA },
															children: [new Paragraph("Employee Type:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2507.2, type: WidthType.DXA },
															children: [new Paragraph(record.EmployeeType || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1080, type: WidthType.DXA },
															children: [new Paragraph({ text: "Status:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2160, type: WidthType.DXA },
															children: [new Paragraph(record.Status || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1382.4, type: WidthType.DXA },
															children: [new Paragraph({ text: "Pay Type:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1972.8, type: WidthType.DXA },
															children: [new Paragraph(record.PayType || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1195.2, type: WidthType.DXA },
															children: [new Paragraph("Budgeted?")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2160, type: WidthType.DXA },
															children: [new Paragraph(record.Budgeted || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1800, type: WidthType.DXA },
															children: [new Paragraph({ text: "Budget Quarter:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2678.4, type: WidthType.DXA },
															children: [new Paragraph(record.BudgetQuarter || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1627.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Budgeted Rate:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1368, type: WidthType.DXA },
															children: [new Paragraph(record.BudgetedRate || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1598.4, type: WidthType.DXA },
															children: [new Paragraph("Job Grade Level:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph(record.C3_662164217858 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1627.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Salary Range:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1627.2, type: WidthType.DXA },
															children: [new Paragraph(`${record.Min}--${record.Max}`)],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2140, type: WidthType.DXA },
															children: [new Paragraph("Relocation Eligible?")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 2798.4, type: WidthType.DXA },
															children: [new Paragraph(record.RelocationEligible || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2347.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Incentive Eligible?", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3628.8, type: WidthType.DXA },
															children: [new Paragraph(record.IncentiveEligible || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 273.6, type: WidthType.DXA },
															children: [new Paragraph("")],
														}),
													]
												})
											]
										}),
									],
								}),
							],
						}),
						new TableRow({
							children: [
								new TableCell({
									borders: {
										bottom: {
											size: 15,
											style: BorderStyle.SINGLE
										},
									},
									margins: { bottom: 120 },
									children: [
										new Table({
											rows: [
												new TableRow({
													height: { height: 224.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															children: [new Paragraph({
																children: [
																	new TextRun({
																		text: "SIGNATURES FOR HIRE: ",
																		bold: true
																	}),
																]
															})],
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
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
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055181038 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055207056 ? record.C3_648055207056.substring(0, 10) : "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Department Manager" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055181827 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055207345 ? record.C3_648055207345.substring(0, 10) : "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({
																children: [
																	new TextRun({
																		text: "Senior Manager "
																	}),
																	new TextRun({
																		text: "(1-Up)",
																		italics: true
																	}),
																]
															})],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055182113 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055207614 ? record.C3_648055207614.substring(1, 10) : "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Local HR" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055182431 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph(record.C3_648055207875 ? record.C3_648055207875.substring(0, 10) : "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "General Manager" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({
																children: [
																	new TextRun({
																		text: "Group VP "
																	}),
																	new TextRun({
																		text: "(If applicable)",
																		italics: true
																	})
																]
															})],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "Segment President" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "President" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
												new TableRow({
													height: { height: 244.8, rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 345.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 1353.6, type: WidthType.DXA },
															children: [new Paragraph("Approved by:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 3600, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 720, type: WidthType.DXA },
															children: [new Paragraph({ text: "Date:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: 1281.6, type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 2419.2, type: WidthType.DXA },
															children: [new Paragraph({ text: "CEO" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
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
										},
									},
									margins: { bottom: 120, top: 120 },
									children: [
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.24), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(1.88), type: WidthType.DXA },
															children: [new Paragraph("Minimum Education Required:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.17), type: WidthType.DXA },
															children: [new Paragraph(record.MinimumEducationRequired || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0.14),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.24), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(1.65), type: WidthType.DXA },
															children: [new Paragraph("Certifications Required:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(4), type: WidthType.DXA },
															children: [new Paragraph(record.CertificationsRequired || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.96), type: WidthType.DXA },
															children: [new Paragraph({ text: "% of Travel:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(0.9), type: WidthType.DXA },
															children: [new Paragraph(record.Travel || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0.14),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.17), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 9070, type: WidthType.DXA },
															children: [new Paragraph("What are keywords that can be used in the resume search?")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														})
													]
												}),
											]
										}),
										getEmptyParagraph(0),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("1)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.48), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950006742 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.37), type: WidthType.DXA },
															children: [new Paragraph({ text: "4)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950015958 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("2)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.48), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950013403 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.37), type: WidthType.DXA },
															children: [new Paragraph({ text: "5)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950017097 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("3)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.48), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950014749 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph("")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.37), type: WidthType.DXA },
															children: [new Paragraph({ text: "6)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950038041 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.34), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(3.7), type: WidthType.DXA },
															children: [new Paragraph("Top 3 Critical Technical/Functional Skills (Knowledge/Skills):")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(3), type: WidthType.DXA },
															children: [new Paragraph("Top 3 Behaviors (Competencies):")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("1)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.5), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950067765 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.54), type: WidthType.DXA },
															children: [new Paragraph({ text: "1)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950072943 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("2)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.5), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950070736 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.54), type: WidthType.DXA },
															children: [new Paragraph({ text: "2)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950101017 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.3), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.29), type: WidthType.DXA },
															children: [new Paragraph("3)")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.5), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950071735 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.54), type: WidthType.DXA },
															children: [new Paragraph({ text: "3)", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.18), type: WidthType.DXA },
															children: [new Paragraph(record.C3_644950102595 || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.19), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
									],
								})
							],
						}),
						new TableRow({
							children: [
								new TableCell({
									borders: {
										bottom: {
											size: 15,
											style: BorderStyle.SINGLE
										},
									},
									margins: { bottom: 120 },
									children: [
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.24), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: 9070, type: WidthType.DXA },
															children: [new Paragraph("FILLED BY:")],
															verticalAlign: VerticalAlign.CENTER,
															margins: margins
														})
													]
												}),
											]
										}),
										getEmptyParagraph(0),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.23), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.56), type: WidthType.DXA },
															children: [new Paragraph("Name:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(3.77), type: WidthType.DXA },
															children: [new Paragraph(record.Name || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(1.45), type: WidthType.DXA },
															children: [new Paragraph({ text: "Date of Hire:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(1.17), type: WidthType.DXA },
															children: [new Paragraph(record.DateofHire || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.76), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
										getEmptyParagraph(0),
										new Table({
											rows: [
												new TableRow({
													height: { height: inchToDxa(0.26), rule: HeightRule.ATLEAST },
													children: [
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.93), type: WidthType.DXA },
															children: [new Paragraph("Rate of Pay:")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(1.72), type: WidthType.DXA },
															children: [new Paragraph(record.RateofPay || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(3.12), type: WidthType.DXA },
															children: [new Paragraph({ text: "Badge Number:", alignment: AlignmentType.RIGHT })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, },
															width: { size: inchToDxa(1.1), type: WidthType.DXA },
															children: [new Paragraph(record.BadgeNumber || "")],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
														new TableCell({
															borders: { top: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL } },
															width: { size: inchToDxa(0.76), type: WidthType.DXA },
															children: [new Paragraph({ text: "" })],
															verticalAlign: VerticalAlign.BOTTOM,
															margins: margins
														}),
													]
												}),
											]
										}),
									],
								})
							]
						}),
					]
				}),
				new Paragraph({
					spacing: { after: 200, before: 1000 },
					children: [new TextRun({ size: 22, text: "KEY JOB DUTIES & RESPONSIBILITIES: ", bold: true })]
				}),
				new Paragraph({
					spacing: { after: 200 },
					children: [new TextRun({ size: 22, text: "(If Contractor/Temporary, please indicate length of project with a maximum 90 days)", italics: true })]
				}),
				new Paragraph({
					children: [new TextRun({ text: record.C3_644950274193 || "", size: 22 })]
				}),
				new Paragraph({
					spacing: { after: 200, before: 1000 },
					children: [new TextRun({ text: "SKILLS & QUALIFICATIONS: ", size: 22, bold: true })]
				}),
				new Paragraph({
					spacing: { after: 200 },
					children: [new TextRun({ text: "(Include Education, Skills & Experience) ", size: 22, italics: true })]
				}),
				new Paragraph({
					children: [new TextRun({ text: record.C3_644950276935 || "", size: 22, italics: true })]
				})]
		})
		Packer.toBlob(doc).then(blob => {
			saveAs(blob, 'II-VI New Hire Req.Form.docx');
		});
	}
	render() {
		return <MainTableSubTables
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
						return <Button size={btnSize} onClick={() => { this.export(record) }}>导出</Button>
					},
				],
				formProps: {
					width: 1250
					// height: 500
				},
				advSearch: {
					isRequestFormData: false
				},
				subtractH: 200
			}} />
	}
}