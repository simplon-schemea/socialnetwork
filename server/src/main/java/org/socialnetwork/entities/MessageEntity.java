package org.socialnetwork.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity(name = "messages")
@Getter
@Setter
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne()
    @JoinColumn(name = "author_id")
    private UserEntity author;

    private Timestamp timestamp;
    private String content;
}
